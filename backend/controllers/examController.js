const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');
const { validateExam } = require('../utils/validators');

const getAllExams = async (req, res) => {
  const { role } = req.user;
  try {
    let query = 'SELECT e.*, u.name as creator_name FROM exams e JOIN users u ON e.created_by = u.id';
    let args = [];
    if (role === 'student') {
      const now = new Date().toISOString();
      query += ' WHERE is_published = 1 AND end_time > ?';
      args.push(now);
    }
    const { rows } = await db.execute({ sql: query, args });
    return successResponse(res, rows);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch exams', 500, error);
  }
};

const createExam = async (req, res) => {
  const validationError = validateExam(req.body);
  if (validationError) return errorResponse(res, validationError, 400);

  const { title, duration, passing_score, start_time, end_time } = req.body;
  const created_by = req.user.id;

  try {
    const result = await db.execute({
      sql: 'INSERT INTO exams (title, duration, passing_score, start_time, end_time, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      args: [title, duration, passing_score, start_time, end_time, created_by]
    });
    return successResponse(res, { id: Number(result.lastInsertRowid), ...req.body }, 'Exam created successfully', 201);
  } catch (error) {
    return errorResponse(res, 'Failed to create exam', 500, error);
  }
};

const getExamById = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  try {
    const { rows: examRows } = await db.execute({
      sql: 'SELECT * FROM exams WHERE id = ?',
      args: [id]
    });

    if (examRows.length === 0) return errorResponse(res, 'Exam not found', 404);

    const exam = examRows[0];
    if (role === 'student' && exam.is_published === 0) {
      return errorResponse(res, 'Exam is not available', 403);
    }

    // Fetch questions
    const { rows: questions } = await db.execute({
      sql: 'SELECT id, type, question_text, options, marks, order_index FROM questions WHERE exam_id = ? ORDER BY order_index ASC',
      args: [id]
    });

    return successResponse(res, { ...exam, questions });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch exam', 500, error);
  }
};

const updateExam = async (req, res) => {
  const { id } = req.params;
  const validationError = validateExam(req.body);
  if (validationError) return errorResponse(res, validationError, 400);

  const { title, duration, passing_score, start_time, end_time } = req.body;

  try {
    await db.execute({
      sql: 'UPDATE exams SET title = ?, duration = ?, passing_score = ?, start_time = ?, end_time = ? WHERE id = ?',
      args: [title, duration, passing_score, start_time, end_time, id]
    });
    return successResponse(res, null, 'Exam updated successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to update exam', 500, error);
  }
};

const deleteExam = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute({
      sql: 'DELETE FROM exams WHERE id = ?',
      args: [id]
    });
    return successResponse(res, null, 'Exam deleted successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to delete exam', 500, error);
  }
};

const publishExam = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute({
      sql: 'UPDATE exams SET is_published = 1 WHERE id = ?',
      args: [id]
    });
    return successResponse(res, null, 'Exam published successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to publish exam', 500, error);
  }
};

const getExamResults = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.execute({
      sql: `SELECT a.*, u.name, u.email 
            FROM attempts a 
            JOIN users u ON a.user_id = u.id 
            WHERE a.exam_id = ? AND a.status = 'submitted'
            ORDER BY a.score DESC`,
      args: [id]
    });
    return successResponse(res, rows);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch results', 500, error);
  }
};

module.exports = {
  getAllExams,
  createExam,
  getExamById,
  updateExam,
  deleteExam,
  publishExam,
  getExamResults
};
