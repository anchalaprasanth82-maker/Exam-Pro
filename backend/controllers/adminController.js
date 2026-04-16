const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getDashboardStats = async (req, res) => {
  try {
    const { rows: examCount } = await db.execute('SELECT count(*) as count FROM exams');
    const { rows: studentCount } = await db.execute("SELECT count(*) as count FROM users WHERE role = 'student'");
    const { rows: submissionCount } = await db.execute("SELECT count(*) as count FROM attempts WHERE status = 'submitted'");
    
    const { rows: recentSubmissions } = await db.execute(`
      SELECT a.*, u.name, e.title 
      FROM attempts a 
      JOIN users u ON a.user_id = u.id 
      JOIN exams e ON a.exam_id = e.id 
      WHERE a.status = 'submitted' 
      ORDER BY a.submit_time DESC 
      LIMIT 10
    `);

    return successResponse(res, {
      totalExams: examCount[0].count,
      totalStudents: studentCount[0].count,
      totalSubmissions: submissionCount[0].count,
      recentSubmissions
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return errorResponse(res, 'Failed to fetch dashboard stats', 500, error);
  }
};

const getAllStudents = async (req, res) => {
  try {
    const { rows } = await db.execute(`
      SELECT u.id, u.name, u.email, u.created_at, 
      (SELECT count(*) FROM attempts WHERE user_id = u.id) as attempt_count 
      FROM users u WHERE u.role = "student"
    `);
    return successResponse(res, rows);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch students', 500, error);
  }
};

const grantRetake = async (req, res) => {
  const { user_id, exam_id } = req.body;
  const granted_by = req.user.id;

  if (!user_id || !exam_id) return errorResponse(res, 'Missing user_id or exam_id', 400);

  try {
    await db.execute({
      sql: 'INSERT INTO retake_permissions (user_id, exam_id, granted_by) VALUES (?, ?, ?) ON CONFLICT(user_id, exam_id) DO NOTHING',
      args: [user_id, exam_id, granted_by]
    });
    return successResponse(res, null, 'Retake permission granted');
  } catch (error) {
    return errorResponse(res, 'Failed to grant retake persistence', 500, error);
  }
};

module.exports = {
  getDashboardStats,
  getAllStudents,
  grantRetake
};
