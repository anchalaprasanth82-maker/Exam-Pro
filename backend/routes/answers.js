const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { requireStudent } = require('../middleware/roleMiddleware');
const { saveAnswer } = require('../controllers/answerController');

router.post('/save', verifyToken, requireStudent, saveAnswer);

module.exports = router;
