const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS to allow React app to make requests
app.use(bodyParser.json()); // Parse incoming requests with JSON payloads
app.use("Access-Control-Allow-Origin", "https://practice-app-backend.onrender.com");

// PostgreSQL connection
const pool = new Pool({
  user: "practice_app_user",
  host: process.env.POSTGRES_HOST,
  database: "practice_app",
  password: process.env.POSTGRES_PASS,
  port: 5432,
  ssl: true,
});

// Example API route to get data from PostgreSQL
app.get("/api/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
