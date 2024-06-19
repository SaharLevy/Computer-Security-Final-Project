const router = require("express").Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const userController = require("../controllers/userController");

router.post("/register", userController.register);

module.exports = router;
