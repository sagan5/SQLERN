const express = require("express");
const router = express.Router();

// variables
const db = require("../../../db");

router.get("/:table/:column/:string?", (req, res) => {
  const { table, column, string } = req.params;

  sql = `SELECT * FROM ${table};`;
  if (string) {
    sql = `SELECT * FROM ${table} WHERE ${column} LIKE '%${string}%';`;
  }

  let results = [];
  db.each(
    sql,
    (err, row) => {
      results.push(row);
    },
    (err, rows) => {
      if (err || !results.length) {
        res.status(404).json({ msg: "NO RESULTS FOUND" });
      } else {
        res.json(results);
      }
    }
  );
});

router.get("/tables", (req, res) => {
  const sql = `SELECT name FROM sqlite_master WHERE type ='table'`;
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(404).json({ msg: "something's wrong" });
    } else {
      // convert response object to array
      res.json(rows.map(row => row.name));
    }
  });
});

router.get("/:table", (req, res) => {
  const { table } = req.params;
  const sql = `PRAGMA table_info(${table});`;
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(404).json({ msg: "something's wrong" });
    } else {
      // convert response object to array
      res.json(rows.map(row => row.name));
    }
  });
});

module.exports = router;
