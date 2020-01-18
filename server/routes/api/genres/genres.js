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
        res.status(404).json({ msg: `There are no genres in database` });
      }
    }
  });
});

// delete single genre by ID
router.delete("/:id", (req, res) => {
  const genreId = req.params.id;

  //   check if genre with provided ID exists and delete if true
  const sql = `SELECT GenreId FROM genres WHERE GenreId = ${genreId}`;
  db.get(sql, (err, row) => {
    if (row) {
      const sql = `DELETE FROM genres WHERE GenreId = ${genreId}`;
      db.run(sql, [], err => {
        if (!err) {
          res.json({
            msg: `Genre with the ID of ${genreId} is deleted`
          });
        } else {
          res.status(404).json({ msg: `${err}` });
        }
      });
    } else {
      res
        .status(404)
        .json({ msg: `Genre with the ID of ${genreId} doesn't exist` });
    }
  });
});

module.exports = router;
