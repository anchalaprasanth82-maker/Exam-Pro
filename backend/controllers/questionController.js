const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');
const { validateQuestion } = require('../utils/validators');
const { importQuestionsFromExcel } = require('../services/excelService');

const getQuestionsByExam = async (req, res) => {
  const { examId } = req.params;
  try {
    const { rows } = await db.execute({
      sql: 'SELECT * FROM questions WHERE exam_id = ? ORDER BY order_index ASC',
      args: [examId]
    });
    return successResponse(res, rows);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch questions', 500, error);
  }
};

const addQuestion = async (req, res) => {
  const validationError = validateQuestion(req.body);
  if (validationError) return errorResponse(res, validationError, 400);

  const { exam_id, type, question_text, options, correct_answer, explanation, marks, order_index } = req.body;

  try {
    const result = await db.execute({
      sql: 'INSERT INTO questions (exam_id, type, question_text, options, correct_answer, explanation, marks, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [exam_id, type, question_text, options ? JSON.stringify(options) : null, correct_answer, explanation, marks, order_index || 0]
    });
    return successResponse(res, { id: Number(result.lastInsertRowid), ...req.body }, 'Question added successfully', 201);
  } catch (error) {
    return errorResponse(res, 'Failed to add question', 500, error);
  }
};

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const validationError = validateQuestion(req.body);
  if (validationError) return errorResponse(res, validationError, 400);

  const { type, question_text, options, correct_answer, explanation, marks, order_index } = req.body;

  try {
    await db.execute({
      sql: 'UPDATE questions SET type = ?, question_text = ?, options = ?, correct_answer = ?, explanation = ?, marks = ?, order_index = ? WHERE id = ?',
      args: [type, question_text, options ? JSON.stringify(options) : null, correct_answer, explanation, marks, order_index, id]
    });
    return successResponse(res, null, 'Question updated successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to update question', 500, error);
  }
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute({
      sql: 'DELETE FROM questions WHERE id = ?',
      args: [id]
    });
    return successResponse(res, null, 'Question deleted successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to delete question', 500, error);
  }
};

const importQuestions = async (req, res) => {
  const { examId } = req.params;
  if (!req.file) {
    return errorResponse(res, 'No file uploaded', 400);
  }

  try {
    const result = await importQuestionsFromExcel(examId, req.file.path);
    return successResponse(res, result, 'Bulk import completed');
  } catch (error) {
    return errorResponse(res, 'Import failed', 500, error);
  }
};

module.exports = {
  getQuestionsByExam,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  importQuestions
};
