const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const errors = require('./../errors.json');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const { username, password, expiryTime } = req.body;

  // Check for missing parameters
  if (!username || !password) {
    const errorType = 'missing-parameters';
    const error = errors[errorType];
    return res.status(error.statusCode).json({
      status: false,
      error: {
        type: errorType,
        message: error.message,
      },
    });
  }

  // Validate input data
  if (
    username.length < 4 || username.length > 20 ||
    password.length < 8 || password.length > 40
  ) {
    const errorType = 'invalid-credentials';
    const error = errors[errorType];
    return res.status(error.statusCode).json({
      status: false,
      error: {
        type: errorType,
        message: error.message,
      },
    });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      const errorType = 'user-not-found';
      const error = errors[errorType];
      return res.status(error.statusCode).json({
        status: false,
        error: {
          type: errorType,
          message: error.message,
        },
      });
    }

    // Compare the plain-text password with the hashed password in the database
    const isMatch = await user.verify(password); // Assuming user.verify is a method to check hashed password

    if (!isMatch) {
      const errorType = 'invalid-credentials';
      const error = errors[errorType];
      return res.status(error.statusCode).json({
        status: false,
        error: {
          type: errorType,
          message: error.message,
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username },
      process.env.jwt_secret_key,
      {
        expiresIn: expiryTime || '24h', // Default expiry time is set to 24 hours
      }
    );

    // Send success response
    const successType = 'user-logged-in';
    const success = errors.success[successType];

    res.status(success.statusCode).json({
      status: true,
      data: {
        message: success.message,
        token,
        userInfo: {
          username: user.username,
          name: user.name,
          userId: user._id,
        },
      },
    });

  } catch (err) {
    console.error(err);
    // Handle internal server error
    const errorType = 'internal-server-error';
    const error = errors[errorType];
    return res.status(error.statusCode).json({
      status: false,
      error: {
        type: errorType,
        message: error.message,
      },
    });
  }
}