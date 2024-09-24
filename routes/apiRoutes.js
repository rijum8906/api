const express = require("express");
const loginController = require("./../controller/")

const Router = express.Router();

Router.post("/login",loginController);