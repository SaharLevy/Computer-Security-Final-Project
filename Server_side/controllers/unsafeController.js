const bcrypt = require("bcrypt");
const { sequelize } = require("../models"); // Assuming sequelize instance is exported from models/index.js
const validatePassword = require("../utils/passwordValidator");

const saltRounds = 10;

exports.register = async (req, res) => {
  const { userName, mail, password } = req.body;

  try {
    // Validate password (optional)
    const validationErrors = validatePassword(password);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Check if user already exists using raw query (unsafe)
    const userCheckQuery = `SELECT * FROM Users WHERE mail = '${mail}'`;
    const [existingUser] = await sequelize.query(userCheckQuery);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Hash password with HMAC + salt
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user using raw query (unsafe)
    const createUserQuery = `
      INSERT INTO Users (userName, mail, password, passwordHistory)
      VALUES ('${userName}', '${mail}', '${hashedPassword}', '["${hashedPassword}"]')
    `;
    await sequelize.query(createUserQuery);

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
