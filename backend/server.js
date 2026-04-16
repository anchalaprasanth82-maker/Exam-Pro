const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createTables } = require('./models/schema');
const { seedData } = require('./models/seed');
const { startTimerService } = require('./services/timerService');

const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exams');
const questionRoutes = require('./routes/questions');
const attemptRoutes = require('./routes/attempts');
const answerRoutes = require('./routes/answers');
const leaderboardRoutes = require('./routes/leaderboard');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// DB Init
const initDB = async () => {
  try {
    await createTables();
    await seedData();
    console.log('Database initialized');
  } catch (error) {
    console.error('DB Initialization failed:', error);
  }
};

initDB();

// Timer Service
startTimerService();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Online Quiz Platform API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
