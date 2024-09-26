const Chat = require('./../models/chatModel');
const errors = require('./../errors.json');

const sendMessage = async (req, res, next) => {
	const userId = req.userId;
	const {message, receiverId} = req.body;

	// Check if message and receiverId are provided
	if (!message || !receiverId) {
		const errorType = 'missing-parameters';
		const error = errors.error[errorType];
		return res.status(error.statusCode).json({
			status: false,
			error: {
				type: errorType,
				message: error.message,
			},
		});
	}

	// Create a new chat document
	const newChat = new Chat({
		sender: userId,
		receiver: receiverId,
		message,
	});

	try {
		await newChat.save();

		// Fetch success message
		const successType = 'message-sent';
		const success = errors.success[successType];

		res.status(success.statusCode).json({
			status: true,
			data: {
				message: success.message,
			},
		});
	} catch (e) {
		console.error(e);
		const errorType = 'internal-server-error';
		const error = errors.error[errorType];
		res.status(error.statusCode).json({
			status: false,
			error: {
				type: errorType,
				message: error.message,
			},
		});
	}
};

const receiveMessage = async (req, res, next) => {
	const userId = req.userId;
	const {receiverId} = req.body;

	// Check if receiverId is provided
	if (!receiverId) {
		const errorType = 'missing-parameters';
		const error = errors.error[errorType];
		return res.status(error.statusCode).json({
			status: false,
			error: {
				type: errorType,
				message: error.message,
			},
		});
	}

	try {
		// Fetch messages where the user is either the sender or receiver
		const messages = await Chat.find({
			$or: [
				{sender: userId, receiver: receiverId},
				{sender: receiverId, receiver: userId},
			],
		}).sort({timestamp: -1});

		const successType = 'messages-retrieved';
		const success = errors.success[successType];

		res.status(success.statusCode).json({
			status: true,
			data: {
				message: success.message,
				messages,
			},
		});
	} catch (e) {
		console.error(e);
		const errorType = 'internal-server-error';
		const error = errors.error[errorType];
		res.status(error.statusCode).json({
			status: false,
			error: {
				type: errorType,
				message: error.message,
			},
		});
	}
};

module.exports = {sendMessage, receiveMessage};
