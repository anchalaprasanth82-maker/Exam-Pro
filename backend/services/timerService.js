const db = require('../config/db');
const { calculateScore } = require('./scoreService');
const { updateLeaderboard } = require('./leaderboardService');

const startTimerService = () => {
  console.log('Timer Service Started: Checking for expired attempts every 30 seconds');
  
  setInterval(async () => {
    try {
      // Find attempts that are in_progress and beyond their duration
      const nowSeconds = Math.floor(Date.now() / 1000);
      const { rows: expiredAttempts } = await db.execute({
        sql: `
          SELECT a.id, a.exam_id, a.start_time, e.duration 
          FROM attempts a 
          JOIN exams e ON a.exam_id = e.id 
          WHERE a.status = 'in_progress' 
          AND (? - strftime('%s', a.start_time)) > (e.duration * 60)
        `,
        args: [nowSeconds]
      });

      for (const attempt of expiredAttempts) {
        console.log(`Auto-submitting attempt ${attempt.id} due to time expiry`);
        
        // Update to auto-submitted status
        await db.execute({
          sql: 'UPDATE attempts SET auto_submitted = 1 WHERE id = ?',
          args: [attempt.id]
        });

        // Compute score and update leaderboard
        await calculateScore(attempt.id);
        await updateLeaderboard(attempt.exam_id);
      }
    } catch (error) {
      console.error('Error in Timer Service:', error);
    }
  }, 30000); // Check every 30 seconds
};

module.exports = { startTimerService };
