const express = require("express");
const router = express.Router();

// variables
const db = require("../../../db");

//  get single invoice by ID using db.get method
router.get("/:id", (req, res) => {
  const invoiceId = req.params.id;
  const sql = `SELECT * FROM invoices WHERE InvoiceId = ${invoiceId}`;
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

router.get("/table/:table", (req, res) => {
  const table = req.params.table;
  const column = req.params.column;
  const string = req.params.string;
  //   const sql = `SELECT * FROM ${table} WHERE ${column} LIKE '%${string}%';`;
  const sql = `SELECT * FROM ${table} WHERE Title LIKE '%us%';`;
  let results = [];
  console.log("im here 1");
  db.each(
    sql,
    (err, row) => {
      console.log("im here 2");
      results.push(row);
    },
    (err, rows) => {
      if (err) {
        res.status(404).json({ msg: "something's wrong" });
      } else {
        res.json(results);
      }
    }
  );
});

module.exports = router;
