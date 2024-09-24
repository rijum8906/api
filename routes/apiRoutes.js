const express = require("express");
const loginController = require("./../controller/loginController")
const registrationController = require("./controller/registrationController")

const Router = express.Router();

Router.post("/login-user",loginController);
Router.put("/register-user",registrationController);