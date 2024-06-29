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
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n
Please paste this into your browser to complete the process:\n
             ${token}\n\n
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

exports.verifyToken = async (req, res) => {
  const { mail, token } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { mail } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if token is valid
    if (
      user.resetPasswordToken !== token ||
      Date.now() > user.resetPasswordExpires
    ) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    res.status(200).json({ message: "Token is valid." });
  } catch (error) {
    console.error("Error during token verification:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.changePasswordWithoutOld = async (req, res) => {
  const { mail, token, newPassword } = req.body;

  try {
    // Check if user exists
    console.log("Finding user with mail:", mail);
    const user = await User.findOne({ where: { mail } });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found." });
    }

    // Check if token is valid
    console.log("Checking token validity for user:", user.mail);
    if (
      user.resetPasswordToken !== token ||
      Date.now() > user.resetPasswordExpires
    ) {
      console.log("Invalid or expired token");
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    // Validate new password
    console.log("Validating new password");
    const validationErrors = validatePassword(newPassword);
    if (validationErrors.length > 0) {
      console.log("Validation errors:", validationErrors);
      return res.status(400).json({ errors: validationErrors });
    }

    // Hash new password with HMAC + salt
    console.log("Hashing new password");
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password and clear the reset token
    console.log("Updating user password");
    user.password = hashedNewPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log("Password changed successfully for user:", user.mail);
    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error during password change:", error);

    if (error.details) {
      return res.status(400).json({ errors: error.details });
    }

    return res.status(500).json({ error: "Internal server error." });
  }
};
