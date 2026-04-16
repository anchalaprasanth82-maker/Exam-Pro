const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return errorResponse(res, 'Missing required fields', 400);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'student';

    const result = await db.execute({
      sql: 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      args: [name, email, hashedPassword, userRole]
    });

    const userId = Number(result.lastInsertRowid);
    const token = jwt.sign(
      { id: userId, email, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return successResponse(res, {
      token,
      user: { id: userId, name, email, role: userRole }
    }, 'Registration successful', 201);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return errorResponse(res, 'Email already exists', 400);
    }
    return errorResponse(res, 'Registration failed', 500, error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 'Missing required fields', 400);
  }

  try {
    const { rows } = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });

    if (rows.length === 0) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return successResponse(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }, 'Login successful');
  } catch (error) {
    return errorResponse(res, 'Login failed', 500, error);
  }
};

module.exports = { register, login };
