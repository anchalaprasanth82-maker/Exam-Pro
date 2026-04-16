const db = require('../config/db');

const calculateScore = async (attemptId) => {
  try {
    // Get all questions and answers for this attempt
    const { rows: data } = await db.execute({
      sql: `SELECT q.id as question_id, q.type, q.correct_answer, q.marks, a.answer 
            FROM questions q 
            JOIN answers a ON q.id = a.question_id 
            WHERE a.attempt_id = ?`,
      args: [attemptId]
    });

    let totalScore = 0;
    let totalMarks = 0;

    for (const item of data) {
      let isCorrect = 0;
      let marksAwarded = 0;

      const studentAnswer = (item.answer || '').trim().toLowerCase();
      const correctAnswer = (item.correct_answer || '').trim().toLowerCase();

      if (item.type === 'MCQ') {
        if (studentAnswer === correctAnswer) {
          isCorrect = 1;
          marksAwarded = item.marks;
        }
      } else if (item.type === 'SHORT') {
        // Simple string match for short answer
        if (studentAnswer === correctAnswer) {
          isCorrect = 1;
          marksAwarded = item.marks;
        } else if (correctAnswer.includes(studentAnswer) && studentAnswer.length > 2) {
          // Partial credit or loose match simulation
          isCorrect = 1;
          marksAwarded = Math.floor(item.marks * 0.8);
        }
      } else if (item.type === 'CODING') {
        // Coding simulation: Check for key words or basic eval if JS
        // For simplicity, we'll mark as manual review OR 
        // if the answer is not empty, give some marks for now.
        if (studentAnswer.length > 20) {
          isCorrect = 1;
          marksAwarded = item.marks; // Assuming they wrote something relevant
        }
      }

      totalScore += marksAwarded;
      totalMarks += item.marks;

      // Update answer status in DB
      await db.execute({
        sql: 'UPDATE answers SET is_correct = ?, marks_awarded = ? WHERE attempt_id = ? AND question_id = ?',
        args: [isCorrect, marksAwarded, attemptId, item.question_id]
      });
    }

    // Update attempt with total score
    await db.execute({
      sql: "UPDATE attempts SET score = ?, total_marks = ?, status = 'submitted', submit_time = CURRENT_TIMESTAMP WHERE id = ?",
      args: [totalScore, totalMarks, attemptId]
    });

    return { totalScore, totalMarks };
  } catch (error) {
    console.error('Error calculating score:', error);
    throw error;
  }
};

module.exports = { calculateScore };
