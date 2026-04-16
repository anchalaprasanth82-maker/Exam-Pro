const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const {
  getDashboardStats,
  exportAllData,
  getAllStudents,
  grantRetake,
  getSubmissionDetail
} = require('../controllers/adminController');

router.get('/dashboard', verifyToken, requireAdmin, getDashboardStats);
router.get('/export', verifyToken, requireAdmin, exportAllData);
router.get('/students', verifyToken, requireAdmin, getAllStudents);
router.get('/submissions/:id', verifyToken, requireAdmin, getSubmissionDetail);
router.post('/retake', verifyToken, requireAdmin, grantRetake);

module.exports = router;
