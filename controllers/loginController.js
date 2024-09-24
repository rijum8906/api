const User = require('./models/userModel');
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
	const {username, password, expiryTime} = req.body;

	if (!username || !password) {
		return res.status(409).json({
			message: 'insufficient data',
			status: false,
		});
	}

	if (
		username.length < 4 ||
		username.length > 20 ||
		password.length < 8 ||
		password.length > 40
	) {
		return res.status(409).json({
			message: 'invalid data',
			status: false,
		});
	}

	const user = await User.findOne({username, password});

	if (!user) {
		return res.status(401).json({
			message: 'no user found',
			status: false,
		});
	}

	const token = await jwt.sign({id: user.id, username}, secret, {
		expiresIn: expiryTime || '24h',
	});

	res.status(200).json({
		message: 'user found',
		status: true,
		token,
	});
};
