const express = require("express");
//const mysql = require("mysql2");
const userRoutes = require("./routes/userRoutes");
const systemRoutes = require("./routes/systemRoutes");
const unsafeRoutes = require("./routes/unsafeRoutes");
//const sequelize = require("./models/index");
const dotenv = require("dotenv");
const db = require("./models");
const cors = require("cors");

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
  })
);

app.use(express.json());

app.use("/api/unsafe", unsafeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/system", systemRoutes);

db.sequelize.sync().then((req) => {
  app.listen(port, async () => {
    try {
      // Test the database connection
      //await sequelize.authenticate();
      console.log("Connection has been established successfully.");

      // Sync models with the database
      //await sequelize.sync();

      console.log(`Server is running on port ${port}`);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  });
});
