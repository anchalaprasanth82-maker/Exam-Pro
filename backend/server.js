process.env.TZ = 'Asia/Kolkata';
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Online Quiz Platform API is running', timezone: process.env.TZ });
});

// Start Server FIRST (Robust Port Binding for Render)
app.listen(PORT, () => {
  console.log(`🚀 [SERVER] Running on port ${PORT}`);
  console.log(`🕒 [TIMEZONE] Local time set to: ${new Date().toLocaleString()}`);
  
  // Initialize DB in the background
  initializeSystem();
});

const initializeSystem = async () => {
  console.log('🔄 [DB] Initializing database sequence...');
  
  if (!process.env.TURSO_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error('❌ [CONFIG] FATAL: TURSO_URL or TURSO_AUTH_TOKEN is missing in environment variables!');
    return;
  }

  try {
    await createTables();
    console.log('✅ [DB] Tables and indexes verified.');
    
    await seedData();
    console.log('✅ [DB] Seed sequence complete.');
    
    startTimerService();
    console.log('✅ [SYSTEM] Timer service active.');
  } catch (error) {
    console.error('❌ [SYSTEM] Initialization failed:', error.message);
    // On Render, we don't necessarily want to exit if the DB is temporarily down
    // as it will auto-retry. But we log it clearly.
  }
};
