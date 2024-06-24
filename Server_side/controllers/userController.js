const { User } = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validatePassword = require("../utils/passwordValidator");

const saltRounds = 10;

exports.register = async (req, res) => {
  const { userName, mail, password } = req.body;

  try {
    // Validate password
    const validationErrors = validatePassword(password);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

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

    // Check if it's a validation error
    if (error.message === "Password validation failed.") {
      return res.status(400).json({ errors: error.details });
    }

    // For other errors, return a generic internal server error message
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.login = async (req, res) => {
  const { mail, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { mail } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    // Authentication successful
    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.changePassword = async (req, res) => {
  const { mail, oldPassword, newPassword } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { mail } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(400).json({ error: "Incorrect old password." });
    }
    validatePassword(newPassword);
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    // Update user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error during password change:", error);

    if (error.message === "Password validation failed.") {
      return res.status(400).json({ errors: error.details });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

// Function to check password history
const checkPasswordHistory = (newPassword, passwordHistory) => {
  return passwordHistory.some(async (oldPassword) => {
    return await bcrypt.compare(newPassword, oldPassword);
  });
};
