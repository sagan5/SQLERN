const express = require("express");
const router = express.Router();

// variables
const db = require("../../../db");

// get all genres from genres table using db.all method
router.get("/", (req, res) => {
  const sql = "SELECT * from genres";
  db.all(sql, (err, rows) => {
    if (err) {
      res.json({ msg: `${err.message}` });
    } else {
      const genres = rows.map(e => {
        return e;
      });
      if (genres.length >= 1) {
        res.json(genres);
      } else {
        res.json({ msg: `query: "${sql}" returned no results` });
      }
    }
  });
});

module.exports = router;
