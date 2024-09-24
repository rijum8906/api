const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
	const authHeader = req.headers['authorization'];

	// Check if authorization header is present and starts with 'Bearer'
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res
			.status(401)
			.json({message: 'Authorization token missing or invalid'});
	}

	// Extract token from 'Bearer <token>'
	const token = authHeader.split(' ')[1];

	// Verify token
	jwt.verify(token, process.env.jwt_secret_key, (err, decoded) => {
		if (err) {
			return res.status(403).json({message: 'Failed to authenticate token'});
		}

		req.userId = decoded.id;
		next();
	});
};
