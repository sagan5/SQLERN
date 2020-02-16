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

// get tables list from database
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

// get columns list in the table
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

router.delete("/:table/:column/:id", (req, res) => {
  const { table, column, id } = req.params;
  //   check if item with provided ID exists and delete if true
  const sql = `SELECT ${column} FROM ${table} WHERE ${column} = ${id}`;
  db.get(sql, (err, row) => {
    if (row) {
      const sql = `DELETE FROM ${table} WHERE ${column} = ${id}`;
      db.run(sql, [], err => {
        if (!err) {
          res.json({
            msg: `Item in table ${table} with the ID of ${id} is deleted`
          });
        } else {
          res.status(404).json({ msg: `${err}` });
        }
      });
    } else {
      res.status(404).json({
        msg: `Item in table ${table} with the ID of ${id} is not found`
      });
    }
  });
});

// add new entry

router.post("/add/:table", (req, res) => {
  const { table } = req.params;
  const columns = Object.keys(req.body.newEntry)
    .slice(1)
    .join(", ");
  const values = Object.values(req.body.newEntry)
    .slice(1)
    .map(e => `'${e}'`) // add quotation marks around each value
    .join(", ");
  const sql = `INSERT INTO ${table} (${columns}) VALUES (${values});`;
  db.run(sql, [], err => {
    if (!err) {
      res.status(200).json({
        msg: `New entry was successfully created in table ${table}`
      });
    } else {
      res.status(400).json({
        msg: `Error occured while adding new entry to the table ${table}`,
        err
      });
    }
  });
});

router.get("/edit/:table/:column/:id", (req, res) => {
  const { table, column, id } = req.params;
  const sql = `SELECT * FROM ${table} WHERE ${column} = ${id}`;
  db.get(sql, (err, row) => {
    if (err) {
      res.status(404).json({ msg: `Some error happened ${err}` });
    } else {
      if (row) {
        res.json(row);
      } else {
        res
          .status(404)
          .json({ msg: `No invoice found with ID ${req.params.id}` });
      }
    }
  });
});

router.put("/edit/:table/:id", (req, res) => {
  const { entryData } = req.body;
  const { table, id } = req.params;
  const columns = Object.keys(req.body.entryData);
  const values = Object.values(req.body.entryData);
  sqlStatment = columns
    .map((column, index) => {
      return `${column} = '${values[index]}'`;
    })
    .join(", ");
  console.log(sqlStatment);
  const sql = `UPDATE ${table} SET ${sqlStatment} WHERE ${columns[0]} = ${id};`;
  db.run(sql, [], err => {
    console.log(sql);
    if (!err) {
      res.status(200).json({
        msg: `Entry with the ID ${id} in table ${table} was successfully edited`
      });
    } else {
      res.status(404).json({ msg: `${err}` });
    }
  });
});
module.exports = router;
