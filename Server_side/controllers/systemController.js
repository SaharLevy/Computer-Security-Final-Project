const { Client } = require("../models");
const sanitizeHtml = require("sanitize-html");

exports.insertNewClient = async (req, res) => {
  const { fullName, mail } = req.body;

  try {
    // Sanitize inputs to prevent XSS attacks
    const sanitizedFullName = sanitizeHtml(fullName);
    const sanitizedMail = sanitizeHtml(mail);

    // Check if the sanitized inputs have changed
    if (sanitizedFullName !== fullName || sanitizedMail !== mail) {
      return res
        .status(400)
        .json({
          error: "Suspicious input detected. XSS attack attempt blocked.",
        });
    }

    // Check if client exists
    const client = await Client.findOne({ where: { mail: sanitizedMail } });
    if (client) {
      return res.status(400).json({ error: "Client already exists." });
    }

    // Store sanitized inputs in the database
    const newClient = await Client.create({
      fullName: sanitizedFullName,
      mail: sanitizedMail,
    });
    res
      .status(201)
      .json({ message: `${sanitizedFullName} registered successfully.` });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error during fetching clients:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
