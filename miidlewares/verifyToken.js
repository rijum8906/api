const jwt = require('jsonwebtoken');
const errors = require('./../errors.json'); // Consistent error handling
require('dotenv').config();

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if the authorization header is present and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const errorType = 'missing-token'; // Assuming this error type exists in your errors.json
    const error = errors[errorType] || {
      statusCode: 401,
      message: 'Authorization token missing or invalid',
    };

    return res.status(error.statusCode).json({
      status: error.status || false,
      error: {
        type: errorType,
        message: error.message,
      },
    });
  }

  // Extract the token from 'Bearer <token>'
  const token = authHeader.split(' ')[1];

  // Verify the token
  jwt.verify(token, process.env.jwt_secret_key, (err, decoded) => {
    if (err) {
      let errorType;
      // Check if the error is because the token expired
      if (err.name === 'TokenExpiredError') {
        errorType = 'expired-token';
      } else {
        errorType = 'invalid-token';
      }

      const error = errors[errorType] || {
        statusCode: 401,
        message: 'Failed to authenticate token',
      };

      return res.status(error.statusCode).json({
        status: error.status || false,
        error: {
          type: errorType,
          message: error.message,
        },
        redirectTo: '/signin',
      });
    }

    // If the token is valid, attach the decoded user ID to the request object
    req.user = decoded;
    next(); // Move to the next middleware or route handler
  });
};