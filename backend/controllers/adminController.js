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
      totalExams: Number(examCount[0].count),
      totalStudents: Number(studentCount[0].count),
      totalSubmissions: Number(submissionCount[0].count),
      recentSubmissions
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return errorResponse(res, 'Failed to fetch dashboard stats', 500, error);
  }
};

const exportAllData = async (req, res) => {
  try {
    const { rows: exams } = await db.execute('SELECT * FROM exams');
    const { rows: students } = await db.execute("SELECT id, name, email, created_at FROM users WHERE role = 'student'");
    const { rows: attempts } = await db.execute(`
      SELECT a.*, u.name as student_name, e.title as exam_title 
      FROM attempts a 
      JOIN users u ON a.user_id = u.id 
      JOIN exams e ON a.exam_id = e.id
    `);

    const data = {
      platform: 'ExamPortal',
      exportDate: new Date().toISOString(),
      summary: {
        totalExams: exams.length,
        totalStudents: students.length,
        totalSubmissions: attempts.length
      },
      exams,
      students,
      submissions: attempts
    };

    return successResponse(res, data, 'Data exported successfully');
  } catch (error) {
    return errorResponse(res, 'Failed to export data', 500, error);
  }
};

const getAllStudents = async (req, res) => {
  try {
    const { rows } = await db.execute(`
      SELECT u.id, u.name, u.email, u.created_at, 
      (SELECT count(*) FROM attempts WHERE user_id = u.id) as attempt_count 
      FROM users u WHERE u.role = 'student'
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

const getSubmissionDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.execute({
      sql: `
        SELECT a.*, u.name as student_name, u.email as student_email, e.title as exam_title, e.passing_score
        FROM attempts a
        JOIN users u ON a.user_id = u.id
        JOIN exams e ON a.exam_id = e.id
        WHERE a.id = ? AND a.status = 'submitted'
      `,
      args: [id]
    });

    if (rows.length === 0) return errorResponse(res, 'Submission not found', 404);
    
    return successResponse(res, rows[0]);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch submission details', 500, error);
  }
};

module.exports = {
  getDashboardStats,
  exportAllData,
  getAllStudents,
  grantRetake,
  getSubmissionDetail
};
