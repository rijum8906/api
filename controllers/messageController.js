const Chat = require('./../models/chatModel');
const errors = require('./../errors.json');

const sendMessage = async (req, res, next) => {
  const userId = req.userId;
  const { message, receiverId } = req.body;

  // Check if message and receiverId are provided
  if (!message || !receiverId) {
    const errorType = 'missing-parameters';
    const error = errors[errorType];
    return res.status(error.statusCode).json({
      status: error.status,
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
    const success = errors[successType];

    return res.status(success.statusCode).json({
      status: success.status,
      data: {
        message: success.message,
      },
    });
  } catch (e) {
    const errorType = 'internal-server-error';
    const error = errors[errorType];
    return res.status(error.statusCode).json({
      status: error.status,
      error: {
        type: errorType,
        message: error.message,
      },
    });
  }
};

const receiveMessage = async (req, res, next) => {
  const userId = req.userId;
  const { receiverId } = req.body;

  // Check if receiverId is provided
  if (!receiverId) {
    const errorType = 'missing-parameters';
    const error = errors[errorType];
    return res.status(error.statusCode).json({
      status: error.status,
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
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).sort({ timestamp: -1 });

    const successType = 'messages-retrieved';
    const success = errors[successType];

    return res.status(success.statusCode).json({
      status: success.status,
      data: {
        message: success.message,
        messages,
      },
    });
  } catch (e) {
    const errorType = 'internal-server-error';
    const error = errors[errorType];
    return res.status(error.statusCode).json({
      status: error.status,
      error: {
        type: errorType,
        message: error.message,
      },
    });
  }
};

const updateMessage = async (req, res, next) => {
  const userId = req.userId;
  const { messageId, updatedMessage } = req.body;

  // Check if messageId and updatedMessage are provided
  if (!messageId || !updatedMessage) {
    const errorType = 'missing-parameters';
    const error = errors[errorType];
    return res.status(error.statusCode).json({
      status: error.status,
      error: {
        type: errorType,
        message: error.message,
      },
    });
  }

  try {
    // Find and update the message
    const message = await Chat.findOneAndUpdate(
      { _id: messageId, sender: userId },
      { message: updatedMessage },
      { new: true }
    );

    if (!message) {
      const errorType = 'user-not-found';
      const error = errors[errorType];
      return res.status(error.statusCode).json({
        status: error.status,
        error: {
          type: errorType,
          message: "Message not found or you don't have permission to update.",
        },
      });
    }

    const successType = 'message-updated';
    const success = errors[successType];

    return res.status(success.statusCode).json({
      status: success.status,
      data: {
        message: success.message,
        updatedMessage: message,
      },
    });
  } catch (e) {
    const errorType = 'invalid-request';
    const error = errors[errorType];
    return res.status(error.statusCode).json({
      status: error.status,
      error: {
        type: errorType,
        message: error.message,
      },
    });
  }
};

module.exports = { sendMessage, receiveMessage, updateMessage };