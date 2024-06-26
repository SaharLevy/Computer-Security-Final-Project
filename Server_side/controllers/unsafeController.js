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

exports.login = async (req, res) => {
  const { mail, password } = req.body;

  try {
    // Unsafe raw SQL query
    const userCheckQuery = `SELECT * FROM Users WHERE mail = '${mail}'`;
    console.log("Executing query:", userCheckQuery); // Log the query for debugging
    const [userResult] = await sequelize.query(userCheckQuery);
    console.log("Query result:", userResult); // Log the query result for debugging

    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = userResult[0];
    console.log("Found user:", user); // Log the found user for debugging

    // Check if password is correct
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

exports.insertNewClient = async (req, res) => {
  const { fullName, mail } = req.body;

  try {
    // Unsafe raw SQL query to check if client exists
    const clientCheckQuery = `SELECT * FROM Clients WHERE mail = '${mail}'`;
    console.log("Executing query:", clientCheckQuery); // Log the query for debugging
    const [clientResult] = await sequelize.query(clientCheckQuery);

    if (clientResult.length > 0) {
      return res.status(400).json({ error: "Client already exists." });
    }

    // Unsafe raw SQL query to insert a new client
    const insertClientQuery = `INSERT INTO Clients (fullName, mail) VALUES ('${fullName}', '${mail}')`;
    console.log("Executing query:", insertClientQuery); // Log the query for debugging
    await sequelize.query(insertClientQuery);

    res.status(201).json({ message: `${fullName} registered successfully.` });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
