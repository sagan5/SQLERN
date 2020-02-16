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

// get single genre for editing

router.get("/:id", (req, res) => {
  const genreId = req.params.id;
  const sql = `SELECT * FROM genres WHERE GenreId = ${genreId}`;
  db.get(sql, (err, row) => {
    if (err) {
      res.status(404).json({ msg: `Some error happened ${err}` });
    } else {
      if (row) {
        res.status(200).json(row);
      } else {
        res.status(404).json({ msg: `No genre found with ID ${genreId}` });
      }
    }
  });
});

// update genre data

router.put("/edit/:id", (req, res) => {
  const entryId = parseInt(req.params.id);
  const { entryData } = req.body;
  // check if genre with provided ID exists and update if true
  const sql = `SELECT GenreId FROM genres WHERE GenreId = ${entryId}`;
  db.get(sql, (err, row) => {
    if (row) {
      const sql = `UPDATE genres SET Name = '${entryData.Name}' WHERE GenreId = ${entryId};`;
      db.run(sql, [], err => {
        if (!err) {
          res.status(200).json({
            msg: `Genre with the ID ${entryId} was successfully edited`
          });
        } else {
          res.status(404).json({ msg: `${err}` });
        }
      });
    }
  });
});

// delete single genre by ID

router.delete("/:id", (req, res) => {
  const genreId = req.params.id;
  //  check if genre with provided ID exists and delete if true
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
          res.status(400).json({ msg: `${err}` });
        }
      });
    } else {
      res
        .status(404)
        .json({ msg: `Genre with the ID of ${genreId} doesn't exist` });
    }
  });
});

// add new genre

router.post("/add", (req, res) => {
  const { newEntry } = req.body;
  const createTableSql =
    "CREATE TABLE IF NOT EXISTS genres (GenreId INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL, Name NVARCHAR (120))";
  const insertGenreSql = `INSERT INTO genres (Name) VALUES ('${newEntry.Name}')`;
  db.run(createTableSql).run(insertGenreSql, [], err => {
    if (!err) {
      res.status(200).json({
        msg: `Genre with name "${newEntry.Name}" was successfully created`
      });
    } else {
      res.status(400).json({
        msg: `Error occured while adding genre "${newEntry.Name}"`,
        err
      });
    }
  });
});

module.exports = router;
