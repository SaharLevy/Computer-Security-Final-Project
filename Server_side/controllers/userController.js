const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validatePassword = require("../utils/validatePassword");

const saltRounds = 10;

exports.register = async (req, res) => {
  const { userName, mail, password } = req.body;

  // Validate password
  const validationErrors = validatePassword.validatePassword(password);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { mail } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Hash password with HMAC + salt
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      userName,
      mail,
      password: hashedPassword,
      passwordHistory: [hashedPassword],
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Function to check password history
const checkPasswordHistory = (newPassword, passwordHistory) => {
  return passwordHistory.some(async (oldPassword) => {
    return await bcrypt.compare(newPassword, oldPassword);
  });
};
