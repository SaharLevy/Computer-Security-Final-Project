const { User } = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validatePassword = require("../utils/passwordValidator");
const nodemailer = require("nodemailer");

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

exports.forgottenPassword = async (req, res) => {
  const { mail } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { mail } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Generate a random sequence and hash it with SHA-1
    const randomSequence = crypto.randomBytes(20).toString("hex");
    const token = crypto
      .createHash("sha1")
      .update(randomSequence)
      .digest("hex");

    // Save the token and expiration time to the user's record
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Simulate sending the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password
      },
    });

    const mailOptions = {
      from: { name: "Sahar Levy", address: process.env.EMAIL_USER },
      to: user.mail,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             http://localhost:3001/reset/${token}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ error: "Error sending email." });
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "Password reset link sent." });
      }
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
// Function to check password history
const checkPasswordHistory = (newPassword, passwordHistory) => {
  return passwordHistory.some(async (oldPassword) => {
    return await bcrypt.compare(newPassword, oldPassword);
  });
};
