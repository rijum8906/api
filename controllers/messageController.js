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
	  return res.status(200).json({
	    message: "message send successfully",
	    status: true
	  });
	} catch (e) {
	  return res.status(500).json({
	    message: "internal server error",
	    status: false
	  });
	}
};

const receiveMessage = async () => {};

module.exports = {sendMessage, receiveMessage};
