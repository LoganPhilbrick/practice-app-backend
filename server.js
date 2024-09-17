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
// app.use("Access-Control-Allow-Origin", "https://practice-app-backend.onrender.com");

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
    if (!userid) {
      return res.status(400).send("User ID is required");
    }

    const result = await pool.query("SELECT * FROM tasks WHERE userid = $1", [userid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/api/add", async (req, res) => {
  const title = req.query.title;
  const text = req.query.text;
  const userid = req.query.userid;

  try {
    await pool.query("INSERT INTO tasks(title, text, userid) VALUES ($1, $2, $3)", [title, text, userid]);
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
