const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
  user: "practice_app_user",
  host: process.env.POSTGRES_HOST,
  database: "practice_app_4c8f",
  password: process.env.POSTGRES_PASS,
  port: 5432,
  ssl: true,
});

// GET all tasks for a user
app.get("/api/data", async (req, res) => {
  const { userid } = req.query;
  if (!userid) return res.status(400).send("Missing userid");

  try {
    const { rows } = await pool.query("SELECT * FROM tasks WHERE userid = $1", [userid]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Server error");
  }
});

// ADD a new task
app.get("/api/add", async (req, res) => {
  const { title, text, userid } = req.query;
  if (!title || !text || !userid) return res.status(400).send("Missing required fields");

  const taskid = uuidv4();

  try {
    await pool.query("INSERT INTO tasks(title, text, userid, taskid) VALUES ($1, $2, $3, $4)", [title, text, userid, taskid]);
    const { rows } = await pool.query("SELECT * FROM tasks WHERE userid = $1", [userid]);
    res.json(rows);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).send("Server error");
  }
});

// DELETE a task by taskid
app.delete("/api/delete", async (req, res) => {
  const { taskid, userid } = req.query;
  if (!taskid || !userid) return res.status(400).send("Missing taskid or userid");

  try {
    await pool.query("DELETE FROM tasks WHERE taskid = $1 AND userid = $2", [taskid, userid]);
    const { rows } = await pool.query("SELECT * FROM tasks WHERE userid = $1", [userid]);
    res.json(rows);
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
