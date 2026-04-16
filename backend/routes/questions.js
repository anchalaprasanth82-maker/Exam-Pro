const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const {
  getQuestionsByExam,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  importQuestions
} = require('../controllers/questionController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.xlsx' && ext !== '.xls' && ext !== '.csv') {
      return cb(new Error('Only Excel/CSV files are allowed'));
    }
    cb(null, true);
  }
});

router.get('/exam/:examId', verifyToken, getQuestionsByExam);
router.post('/', verifyToken, requireAdmin, addQuestion);
router.put('/:id', verifyToken, requireAdmin, updateQuestion);
router.delete('/:id', verifyToken, requireAdmin, deleteQuestion);
router.post('/import/:examId', verifyToken, requireAdmin, upload.single('file'), importQuestions);

module.exports = router;
