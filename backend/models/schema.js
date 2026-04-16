const db = require('../config/db');

async function createTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      profile_photo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      duration INTEGER NOT NULL,
      passing_score INTEGER NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      is_published INTEGER DEFAULT 0,
      created_by INTEGER REFERENCES users(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      question_text TEXT NOT NULL,
      options TEXT,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      marks INTEGER NOT NULL DEFAULT 1,
      order_index INTEGER DEFAULT 0
    );`,
    `CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      exam_id INTEGER NOT NULL REFERENCES exams(id),
      start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      submit_time DATETIME,
      auto_submitted INTEGER DEFAULT 0,
      status TEXT DEFAULT 'in_progress',
      score INTEGER,
      total_marks INTEGER,
      UNIQUE(user_id, exam_id)
    );`,
    `CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
      question_id INTEGER NOT NULL REFERENCES questions(id),
      answer TEXT,
      is_correct INTEGER DEFAULT 0,
      marks_awarded INTEGER DEFAULT 0,
      saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(attempt_id, question_id)
    );`,
    `CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL REFERENCES exams(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      score INTEGER NOT NULL,
      total_marks INTEGER NOT NULL,
      time_taken INTEGER NOT NULL,
      submit_time DATETIME NOT NULL,
      rank INTEGER,
      UNIQUE(exam_id, user_id)
    );`,
    `CREATE TABLE IF NOT EXISTS retake_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      exam_id INTEGER NOT NULL REFERENCES exams(id),
      granted_by INTEGER REFERENCES users(id),
      granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, exam_id)
    );`
  ];

  const indexes = [
    `CREATE INDEX IF NOT EXISTS idx_questions_exam ON questions(exam_id);`,
    `CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id);`,
    `CREATE INDEX IF NOT EXISTS idx_attempts_exam ON attempts(exam_id);`,
    `CREATE INDEX IF NOT EXISTS idx_answers_attempt ON answers(attempt_id);`,
    `CREATE INDEX IF NOT EXISTS idx_leaderboard_exam ON leaderboard(exam_id);`
  ];

  try {
    for (const table of tables) {
      await db.execute(table);
    }
    for (const index of indexes) {
      await db.execute(index);
    }
    console.log('Tables and indexes created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

module.exports = { createTables };
