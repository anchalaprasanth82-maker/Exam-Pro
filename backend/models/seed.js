const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function seedData() {
  try {
    // Check if users exist
    const { rows: users } = await db.execute('SELECT count(*) as count FROM users');
    if (users[0].count > 0) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding database...');

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const alicePassword = await bcrypt.hash('Alice@123', 10);
    const bobPassword = await bcrypt.hash('Bob@123', 10);

    // Insert Users
    await db.execute({
      sql: 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      args: ['Admin User', 'admin@quizapp.com', adminPassword, 'admin']
    });
    await db.execute({
      sql: 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      args: ['Alice Johnson', 'alice@student.com', alicePassword, 'student']
    });
    await db.execute({
      sql: 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      args: ['Bob Smith', 'bob@student.com', bobPassword, 'student']
    });

    // Get Admin ID
    const { rows: adminRows } = await db.execute("SELECT id FROM users WHERE email = 'admin@quizapp.com'");
    const adminId = adminRows[0].id;

    // Create 2 Sample Exams
    const now = new Date();
    const startTime1 = new Date(now.getTime() - 3600000).toISOString(); // 1 hour ago
    const endTime1 = new Date(now.getTime() + 86400000).toISOString(); // 1 day from now
    
    // Exam 1: General Knowledge
    const exam1Result = await db.execute({
      sql: 'INSERT INTO exams (title, duration, passing_score, start_time, end_time, is_published, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: ['Node.js & JavaScript Fundamentals', 60, 60, startTime1, endTime1, 1, adminId]
    });
    const exam1Id = Number(exam1Result.lastInsertRowid);

    // Questions for Exam 1
    const questions1 = [
      {
        type: 'MCQ',
        text: 'What is the role of the package.json file?',
        options: JSON.stringify(['To store UI themes', 'To list dependencies and project metadata', 'To store user passwords', 'To compile C++ code']),
        answer: 'To list dependencies and project metadata',
        explanation: 'package.json is the manifest file for Node.js projects.',
        marks: 2
      },
      {
        type: 'MCQ',
        text: 'Which keyword is used to declare a block-scoped variable in JS?',
        options: JSON.stringify(['var', 'let', 'define', 'global']),
        answer: 'let',
        explanation: 'let and const are block-scoped.',
        marks: 2
      },
      {
        type: 'SHORT',
        text: 'What does "API" stand for?',
        options: null,
        answer: 'Application Programming Interface',
        explanation: 'API is a set of rules for communication between systems.',
        marks: 5
      },
      {
        type: 'CODING',
        text: 'Write a function sum(a, b) that returns the sum of two numbers.',
        options: null,
        answer: 'function sum(a, b) { return a + b; }',
        explanation: 'Basic function syntax.',
        marks: 10
      },
      {
        type: 'MCQ',
        text: 'Which module is used for creating a web server in Node.js?',
        options: JSON.stringify(['fs', 'http', 'path', 'os']),
        answer: 'http',
        explanation: 'The http module allows Node.js to transfer data over HTTP.',
        marks: 2
      }
    ];

    for (let i = 0; i < questions1.length; i++) {
        const q = questions1[i];
        await db.execute({
          sql: 'INSERT INTO questions (exam_id, type, question_text, options, correct_answer, explanation, marks, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          args: [exam1Id, q.type, q.text, q.options, q.answer, q.explanation, q.marks, i]
        });
    }

    // Exam 2: Python Basics
    const startTime2 = new Date(now.getTime()).toISOString();
    const endTime2 = new Date(now.getTime() + 172800000).toISOString(); // 2 days from now
    const exam2Result = await db.execute({
      sql: 'INSERT INTO exams (title, duration, passing_score, start_time, end_time, is_published, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: ['Python Programming Basics', 30, 50, startTime2, endTime2, 1, adminId]
    });
    const exam2Id = Number(exam2Result.lastInsertRowid);

    const questions2 = [
      {
        type: 'MCQ',
        text: 'Which data type is used to store multiple items in a single variable in Python?',
        options: JSON.stringify(['list', 'int', 'float', 'bool']),
        answer: 'list',
        explanation: 'Lists are used to store multiple items in a single variable.',
        marks: 5
      },
      {
        type: 'MCQ',
        text: 'How do you insert COMMENTS in Python code?',
        options: JSON.stringify(['//', '#', '/*', '<!--']),
        answer: '#',
        explanation: 'Python uses the # character for comments.',
        marks: 5
      },
      {
        type: 'SHORT',
        text: 'What is the correct file extension for Python files?',
        options: null,
        answer: '.py',
        explanation: 'Python source files use .py.',
        marks: 5
      },
      {
        type: 'MCQ',
        text: 'Which function is used to get the length of a list?',
        options: JSON.stringify(['len()', 'length()', 'size()', 'count()']),
        answer: 'len()',
        explanation: 'len() returns the number of items in an object.',
        marks: 5
      },
      {
        type: 'CODING',
        text: 'Write a Python program to check if a number is even or odd.',
        options: null,
        answer: 'num = int(input())\nif num % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")',
        explanation: 'Using modulo operator.',
        marks: 10
      }
    ];

    for (let i = 0; i < questions2.length; i++) {
        const q = questions2[i];
        await db.execute({
          sql: 'INSERT INTO questions (exam_id, type, question_text, options, correct_answer, explanation, marks, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          args: [exam2Id, q.type, q.text, q.options, q.answer, q.explanation, q.marks, i]
        });
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

module.exports = { seedData };
