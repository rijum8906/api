const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const errors = require('./../errors.json');
require('dotenv').config();
const bcrypt = require('bcryptjs'); // Assuming you are hashing passwords

module.exports = async (req, res, next) => {
  const { name, email, username, password, expiryTime } = req.body;

  // Check if all required fields are provided
  if (!email || !name || !username || !password) {
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

  // Validate field lengths
  if (
    name.length < 4 || name.length > 25 ||
    email.length < 8 || email.length > 25 ||
    username.length < 4 || username.length > 20 ||
    password.length < 8 || password.length > 40
  ) {
    const errorType = 'invalid-request';
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
    // Check if a user with the same email or username already exists
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
      const errorType = 'user-already-exists';
      const error = errors[errorType];
      return res.status(error.statusCode).json({
        status: false,
        error: {
          type: errorType,
          message: error.message,
        },
      });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user with the hashed password
    const newUser = new User({ name, email, username, password: hashedPassword });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: savedUser._id, username },
      process.env.jwt_secret_key,
      { expiresIn: expiryTime || '24h' },
    );

    // Fetch success message from errors.json
    const successType = 'user-registered';
    const success = errors[successType];

    // Return success response
    res.status(success.statusCode).json({
      status: true,
      data: {
        message: success.message,
        token,
      },
    });
  } catch (e) {
    console.error(e);
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
};