const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getLeaderboardByExam = async (req, res) => {
  const { examId } = req.params;
  try {
    const { rows } = await db.execute({
      sql: `SELECT l.*, u.name 
            FROM leaderboard l 
            JOIN users u ON l.user_id = u.id 
            WHERE l.exam_id = ? 
            ORDER BY l.rank ASC`,
      args: [examId]
    });
    return successResponse(res, rows);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch leaderboard', 500, error);
  }
};

module.exports = { getLeaderboardByExam };
