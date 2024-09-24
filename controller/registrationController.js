const User = require('./models/userModel');
const jwt = require('jsonwebtoken');
require("dotenv").config();
module.exports = async (req, res, next) => {
	const {name, email, username, password, expiryTime} = req.body;

	if (!email || !name || !username || !password) {
		return res.status(409).json({
			message: 'insufficient data',
			status: false,
		});
	}

	if (
		name.length < 4 ||
		name.length > 25 ||
		email.length < 8 ||
		email.length > 25 ||
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

	const user =
		(await User.findOne({username})) || (await User.findOne({email}));

	if (user) {
		return res.status(409).json({
			message: 'user already exists',
			status: false,
		});
	}

	const newUser = new User({name, email, username, password});

	try {
		const savedUser = await newUser.save();
		
		const token = jwt.sign(
			{id: savedUser._id, username},
			process.env.jwt_secret_key,
			{expiresIn: expiryTime || '24h'},
		);
		
		res.status(200).json({
			message: 'user registered successfully ',
			status: true,
			token
		});
	} catch (e) {
		res.status(500).json({
			message: 'internal server error',
			status: false,
		});
	}
};
