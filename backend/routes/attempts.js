const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { requireStudent } = require('../middleware/roleMiddleware');
const {
  startAttempt,
  resumeAttempt,
  submitAttempt,
  getMyAttempts
} = require('../controllers/attemptController');

router.post('/start', verifyToken, requireStudent, startAttempt);
router.get('/resume/:examId', verifyToken, requireStudent, resumeAttempt);
router.post('/submit', verifyToken, requireStudent, submitAttempt);
router.get('/my', verifyToken, requireStudent, getMyAttempts);

module.exports = router;
