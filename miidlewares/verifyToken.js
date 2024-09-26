const jwt = require('jsonwebtoken');
const errors = require('./../errors.json'); // Assuming you're using errors.json for consistent error handling
require('dotenv').config();

module.exports = async (req, res, next) => {
	const authHeader = req.headers['authorization'];

	// Check if the authorization header is present and starts with 'Bearer'
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		const errorType = 'missing-token'; // Assuming this error type exists in your errors.json
		const error = errors.error[errorType] || {
			statusCode: 401,
			message: 'Authorization token missing or invalid',
		};

		return res.status(error.statusCode).json({
			status: false,
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
			var errorType;
			if (err.toString() === 'TokenExpiredError: jwt expired') {
				errorType = 'expired-token';
			} else {
				errorType = 'invalid-token';
			}
			const error = errors.error[errorType] || {
				statusCode: 403,
				message: 'Failed to authenticate token',
			};
			return res.status(error.statusCode).json({
				status: false,
				error: {
					type: errorType,
					message: error.message,
				},
				redirectTo: '/signin',
			});
		}

		// If the token is valid, attach the decoded user ID to the request object
		next(); // Move to the next middleware or route handler
	});
};
