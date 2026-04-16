const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const {
  getAllExams,
  createExam,
  getExamById,
  updateExam,
  deleteExam,
  publishExam,
  getExamResults
} = require('../controllers/examController');

router.get('/', verifyToken, getAllExams);
router.post('/', verifyToken, requireAdmin, createExam);
router.get('/:id', verifyToken, getExamById);
router.put('/:id', verifyToken, requireAdmin, updateExam);
router.delete('/:id', verifyToken, requireAdmin, deleteExam);
router.post('/:id/publish', verifyToken, requireAdmin, publishExam);
router.get('/:id/results', verifyToken, requireAdmin, getExamResults);

module.exports = router;
