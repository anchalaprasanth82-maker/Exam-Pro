const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getLeaderboardByExam } = require('../controllers/leaderboardController');

router.get('/:examId', verifyToken, getLeaderboardByExam);

module.exports = router;
