const { errorResponse } = require('../utils/response');

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorResponse(res, 'Access denied. Admin role required.', 403);
  }
};

const requireStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    return errorResponse(res, 'Access denied. Student role required.', 403);
  }
};

module.exports = { requireAdmin, requireStudent };
