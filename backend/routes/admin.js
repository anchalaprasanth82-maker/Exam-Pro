const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const {
  getDashboardStats,
  getAllStudents,
  grantRetake
} = require('../controllers/adminController');

router.get('/dashboard', verifyToken, requireAdmin, getDashboardStats);
router.get('/students', verifyToken, requireAdmin, getAllStudents);
router.post('/retake', verifyToken, requireAdmin, grantRetake);

module.exports = router;
