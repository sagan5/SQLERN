const express = require("express");
const router = express.Router();

// variables
const db = require("../../../db");

// get all names from cats table using db.each method
router.get("/", (req, res) => {
  const sql = "SELECT id, name FROM cats";
  const cats = [];
  db.each(
    sql,
    (err, row) => {
      cats.push(row);
    },
    err => {
      if (err) {
        res.json({ msg: `${err.message}` });
      } else {
        if (cats.length < 1) {
          res.json({ msg: `query: "${sql}" returned no results` });
        } else {
          res.json(cats);
        }
      }
    }
  );
});

module.exports = router;
