const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');
const { calculateScore } = require('../services/scoreService');
const { updateLeaderboard } = require('../services/leaderboardService');

const startAttempt = async (req, res) => {
  const { exam_id } = req.body;
  const user_id = req.user.id;

  try {
    // Check if exam exists and is published
    const { rows: examRows } = await db.execute({
      sql: 'SELECT * FROM exams WHERE id = ? AND is_published = 1',
      args: [exam_id]
    });

    if (examRows.length === 0) return errorResponse(res, 'Exam not found or not published', 404);
    const exam = examRows[0];

    // Check for prior submitted attempt
    const { rows: priorAttempts } = await db.execute({
      sql: "SELECT status FROM attempts WHERE user_id = ? AND exam_id = ?",
      args: [user_id, exam_id]
    });

    if (priorAttempts.length > 0) {
      const attempt = priorAttempts[0];
      if (attempt.status === 'submitted') {
        // Check for retake permission
        const { rows: retakeRows } = await db.execute({
          sql: 'SELECT id FROM retake_permissions WHERE user_id = ? AND exam_id = ?',
          args: [user_id, exam_id]
        });

        if (retakeRows.length === 0) {
          return errorResponse(res, 'Exam already completed. No retake permission granted.', 403);
        }
        
        // If retake granted, we can either clear old attempt or somehow allow new one.
        // For simplicity, let's delete the old attempt and retake permission.
        await db.execute({ sql: 'DELETE FROM attempts WHERE user_id = ? AND exam_id = ?', args: [user_id, exam_id] });
        await db.execute({ sql: 'DELETE FROM retake_permissions WHERE user_id = ? AND exam_id = ?', args: [user_id, exam_id] });
      } else {
        // Already in progress, return resume info
        return successResponse(res, { attempt_id: attempt.id, status: 'in_progress' }, 'Resume existing attempt');
      }
    }

    // Create new attempt
    const result = await db.execute({
      sql: "INSERT INTO attempts (user_id, exam_id, start_time, status) VALUES (?, ?, CURRENT_TIMESTAMP, 'in_progress')",
      args: [user_id, exam_id]
    });

    const attemptId = Number(result.lastInsertRowid);

    // Fetch questions (without answers)
    const { rows: questions } = await db.execute({
      sql: 'SELECT id, type, question_text, options, marks, order_index FROM questions WHERE exam_id = ? ORDER BY order_index ASC',
      args: [exam_id]
    });

    return successResponse(res, {
      attempt_id: attemptId,
      questions,
      time_remaining: exam.duration * 60,
      start_time: new Date().toISOString()
    }, 'Exam started');

  } catch (error) {
    return errorResponse(res, 'Failed to start attempt', 500, error);
  }
};

const resumeAttempt = async (req, res) => {
  const { examId } = req.params;
  const user_id = req.user.id;

  try {
    const { rows: attemptRows } = await db.execute({
      sql: "SELECT * FROM attempts WHERE user_id = ? AND exam_id = ? AND status = 'in_progress'",
      args: [user_id, examId]
    });

    if (attemptRows.length === 0) return errorResponse(res, 'No active attempt found', 404);
    const attempt = attemptRows[0];

    const { rows: examRows } = await db.execute({
      sql: 'SELECT duration FROM exams WHERE id = ?',
      args: [examId]
    });
    const exam = examRows[0];

    // Calculate time remaining
    const startTime = new Date(attempt.start_time);
    const now = new Date();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const timeRemaining = (exam.duration * 60) - elapsedSeconds;

    if (timeRemaining <= 0) {
      // Auto-submit if time expired
      await calculateScore(attempt.id);
      await updateLeaderboard(examId);
      return errorResponse(res, 'Time expired. Attempt auto-submitted.', 403);
    }

    // Fetch questions and saved answers
    const { rows: questions } = await db.execute({
      sql: 'SELECT id, type, question_text, options, marks, order_index FROM questions WHERE exam_id = ? ORDER BY order_index ASC',
      args: [examId]
    });

    const { rows: answers } = await db.execute({
      sql: 'SELECT question_id, answer FROM answers WHERE attempt_id = ?',
      args: [attempt.id]
    });

    return successResponse(res, {
      attempt_id: attempt.id,
      questions,
      answers,
      time_remaining: timeRemaining
    }, 'Attempt resumed');

  } catch (error) {
    return errorResponse(res, 'Failed to resume attempt', 500, error);
  }
};

const submitAttempt = async (req, res) => {
  const { attempt_id } = req.body;
  const user_id = req.user.id;

  try {
    const { rows: attemptRows } = await db.execute({
      sql: 'SELECT * FROM attempts WHERE id = ? AND user_id = ?',
      args: [attempt_id, user_id]
    });

    if (attemptRows.length === 0) return errorResponse(res, 'Attempt not found', 404);
    if (attemptRows[0].status === 'submitted') return errorResponse(res, 'Attempt already submitted', 400);

    const result = await calculateScore(attempt_id);
    await updateLeaderboard(attemptRows[0].exam_id);

    return successResponse(res, result, 'Attempt submitted successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to submit attempt', 500, error);
  }
};

const getMyAttempts = async (req, res) => {
  const user_id = req.user.id;
  try {
    const { rows } = await db.execute({
      sql: `SELECT a.*, e.title as exam_title, e.passing_score 
            FROM attempts a 
            JOIN exams e ON a.exam_id = e.id 
            WHERE a.user_id = ? 
            ORDER BY a.start_time DESC`,
      args: [user_id]
    });
    return successResponse(res, rows);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch attempts', 500, error);
  }
};

module.exports = {
  startAttempt,
  resumeAttempt,
  submitAttempt,
  getMyAttempts
};
