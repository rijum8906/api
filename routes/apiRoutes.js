const express = require('express');
const loginController = require('./../controllers/loginController');
const registrationController = require('./../controllers/registrationController');
const messageController = require('./../controllers/messageController');
const verifyToken = require('./../miidlewares/verifyToken');

const Router = express.Router();

Router.post('/login-user', loginController);
Router.put('/register-user', registrationController);
Router.post('/send-message', verifyToken, messageController.sendMessage);
Router.post("/get-messages",verifyToken,messageController.receiveMessage)