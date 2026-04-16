const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const saveAnswer = async (req, res) => {
  const { attempt_id, question_id, answer } = req.body;

  if (!attempt_id || !question_id) {
    return errorResponse(res, 'Missing attempt_id or question_id', 400);
  }

  try {
    // UPSERT answer
    await db.execute({
      sql: `INSERT INTO answers (attempt_id, question_id, answer, saved_at) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(attempt_id, question_id) DO UPDATE SET 
            answer = excluded.answer,
            saved_at = excluded.saved_at`,
      args: [attempt_id, question_id, answer || '']
    });

    return successResponse(res, null, 'Answer saved');
  } catch (error) {
    return errorResponse(res, 'Failed to save answer', 500, error);
  }
};

module.exports = { saveAnswer };
