const Chat = require('./../models/chatModel');

const sendMessage = async (req, res, next) => {
	const userId = req.userId;

	const {message, receiverId} = req.body;

	if (!message || !receiverId) {
		return res.status(409).json({
			message: 'insufficient data',
			status: false,
		});
	}

	const newChat = new Chat({
		sender: userId,
		receiver: receiverId,
		message,
	});

	try {
		await newChat.save();
		res.status(200).json({
			message: 'message send successfully',
			status: true,
		});
	} catch (e) {
		res.status(500).json({
			message: 'internal server error',
			status: false,
		});
	}
};

const receiveMessage = async (req, res, next) => {
	const userId = req.userId;
	const {receiverId} = req.body;

	if (!receiverId || !userId) {
		return res.status(409).json({
			messages: 'insufficient data',
			status: false,
		});
	}

	const messages = await Chat.find({
		$or: [{sender: userId}, {receiver: receiverId}],
	}).sort({timestamp: -1});

	res.status(200).json({
		message: 'Messages retrieved successfully',
		data: messages,
	});
};

module.exports = {sendMessage, receiveMessage};
