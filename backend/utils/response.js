const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    error: null
  });
};

const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    error: error ? error.message || error : null
  });
};

module.exports = { successResponse, errorResponse };
