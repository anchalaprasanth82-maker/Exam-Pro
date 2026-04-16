const db = require('../config/db');

const updateLeaderboard = async (examId) => {
  try {
    // Fetch all submitted attempts for this exam
    const { rows: attempts } = await db.execute({
      sql: `SELECT id, user_id, score, total_marks, start_time, submit_time 
            FROM attempts 
            WHERE exam_id = ? AND status = 'submitted'
            ORDER BY score DESC, 
            (strftime('%s', submit_time) - strftime('%s', start_time)) ASC, 
            submit_time ASC`,
      args: [examId]
    });

    // Clear existing leaderboard for this exam
    await db.execute({
      sql: 'DELETE FROM leaderboard WHERE exam_id = ?',
      args: [examId]
    });

    // Insert ranked results
    for (let i = 0; i < attempts.length; i++) {
      const a = attempts[i];
      const timeTaken = Math.floor((new Date(a.submit_time) - new Date(a.start_time)) / 1000);

      await db.execute({
        sql: `INSERT INTO leaderboard (exam_id, user_id, score, total_marks, time_taken, submit_time, rank) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [examId, a.user_id, a.score, a.total_marks, timeTaken, a.submit_time, i + 1]
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    throw error;
  }
};

module.exports = { updateLeaderboard };
