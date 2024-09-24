const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // Reference to the User model
			required: true,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // Reference to the User model
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
