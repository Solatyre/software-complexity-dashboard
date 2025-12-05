const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// POSTGRES CONNECTION
// --------------------
const pool = new Pool({
  user: "hc25-33",
  host: "localhost",
  database: "hc25_33",
  password: "Complexity123!",
  port: 5432,
  ssl: false,
});

// Test database connection
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM class_metrics;");
    res.send(
      `Backend OK ✔️ | class_metrics rows: ${result.rows[0].count}`
    );
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).send("DB connection failed ❌");
  }
});

// -----------------------------------------------------------
// ORIGINAL ENDPOINTS (frontend already uses these)
// -----------------------------------------------------------

// → Complexity over time
app.get("/api/complexity_histogram", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        repository_name,
        date_trunc('week', commit_date) AS week,
        AVG(class_complexity) AS avg_complexity
      FROM class_metrics
      WHERE class_complexity IS NOT NULL
      GROUP BY repository_name, week
      ORDER BY repository_name, week;
    `);

    res.json(
      result.rows.map((row) => ({
        repository_name: row.repository_name,
        week: row.week.toISOString().slice(0, 10),
        avg_complexity: Number(row.avg_complexity),
      }))
    );
  } catch (err) {
    console.error("Error /api/complexity_histogram:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// → LOC range by repo
app.get("/api/loc_range", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        repository_name,
        MIN(class_loc) AS min_loc,
        MAX(class_loc) AS max_loc
      FROM class_metrics
      WHERE class_loc IS NOT NULL
      GROUP BY repository_name
      ORDER BY repository_name;
    `);

    res.json(
      result.rows.map((row) => ({
        repository_name: row.repository_name,
        min_loc: Number(row.min_loc),
        max_loc: Number(row.max_loc),
      }))
    );
  } catch (err) {
    console.error("Error /api/loc_range:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// → Complexity density
app.get("/api/complexity_density", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        repository_name,
        AVG(complexity_density) AS avg_complexity_density
      FROM class_metrics
      WHERE complexity_density IS NOT NULL
      GROUP BY repository_name
      ORDER BY repository_name;
    `);

    res.json(
      result.rows.map((row) => ({
        repository_name: row.repository_name,
        avg_complexity_density: Number(row.avg_complexity_density),
      }))
    );
  } catch (err) {
    console.error("Error /api/complexity_density:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------------
// NEW ENDPOINTS
// -----------------------------------------------------------

// → All project names (for dynamic dropdown)
app.get("/api/projects", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT repository_name
      FROM class_metrics
      ORDER BY repository_name;
    `);
    res.json(result.rows.map((r) => r.repository_name));
  } catch (err) {
    console.error("Error /api/projects:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// → Top 10 complex classes (hotspots)
app.get("/api/hotspots", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        repository_name,
        class_name,
        class_complexity,
        class_loc,
        fully_qualified_name
      FROM class_metrics
      WHERE class_complexity IS NOT NULL
      ORDER BY class_complexity DESC
      LIMIT 10;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error /api/hotspots:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// → Overview stats for KPI cards
app.get("/api/overview", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) AS total_classes,
        AVG(class_complexity) AS avg_complexity,
        AVG(class_loc) AS avg_loc,
        COUNT(DISTINCT repository_name) AS total_repos
      FROM class_metrics;
    `);

    const row = result.rows[0];

    res.json({
      total_classes: Number(row.total_classes),
      avg_complexity: Number(row.avg_complexity),
      avg_loc: Number(row.avg_loc),
      total_repos: Number(row.total_repos),
    });
  } catch (err) {
    console.error("Error /api/overview:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// → Scatter (LOC vs Complexity)
app.get("/api/class_scatter", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT class_loc, class_complexity
      FROM class_metrics
      WHERE class_loc IS NOT NULL
      AND class_complexity IS NOT NULL
      LIMIT 1000;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error /api/class_scatter:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --------------------
// START SERVER
// --------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
