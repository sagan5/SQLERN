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

// delete single invoice by ID
router.delete("/:id", (req, res) => {
  const invoiceId = req.params.id;

  //   check if invoice with provided ID exists and delete if true
  const sql = `SELECT InvoiceId FROM invoices WHERE InvoiceId = ${invoiceId}`;
  db.get(sql, (err, row) => {
    if (row) {
      const sql = `DELETE FROM invoices WHERE InvoiceId = ${invoiceId}`;
      db.run(sql, [], err => {
        if (!err) {
          res.json({
            msg: `Invoice with the ID of ${invoiceId} is deleted`
          });
        } else {
          res.status(404).json({ msg: `${err}` });
        }
      });
    } else {
      res
        .status(404)
        .json({ msg: `Invoice with the ID of ${invoiceId} doesn't exist` });
    }
  });
});

// add new invoice

router.post("/add", (req, res) => {
  const { newEntry } = req.body;
  const sql = `INSERT INTO invoices (Total, BillingPostalCode, BillingCountry, BillingState, BillingCity, BillingAddress, InvoiceDate, CustomerId) VALUES (${newEntry.Total}, ${newEntry.BillingPostalCode}, '${newEntry.BillingCountry}', '${newEntry.BillingState}', '${newEntry.BillingCity}', '${newEntry.BillingAddress}', '${newEntry.InvoiceDate}', ${newEntry.CustomerId});`;
  db.run(sql, [], err => {
    if (!err) {
      res.status(200).json({
        msg: `Invoice was successfully created`
      });
    } else {
      res.status(400).json({ msg: `Error occured while adding invoice`, err });
    }
  });
});

// update invoice data

router.put("/edit/:id", (req, res) => {
  const entryId = parseInt(req.params.id);
  const { entryData } = req.body;
  console.log(entryData);
  // check if genre with provided ID exists and update if true
  const sql = `SELECT InvoiceId FROM invoices WHERE InvoiceId = ${entryId}`;
  db.get(sql, (err, row) => {
    if (row) {
      const sql = `UPDATE invoices SET CustomerId = '${entryData.CustomerId}', InvoiceDate = '${entryData.InvoiceDate}', BillingAddress = '${entryData.BillingAddress}', BillingCity = '${entryData.BillingCity}', BillingState = '${entryData.BillingState}', BillingCountry = '${entryData.BillingCountry}', BillingPostalCode = '${entryData.BillingPostalCode}', Total = '${entryData.Total}' WHERE InvoiceID = ${entryId};`;
      db.run(sql, [], err => {
        if (!err) {
          res.status(200).json({
            msg: `Invoice with the ID ${entryId} was successfully edited`
          });
        } else {
          res.status(404).json({ msg: `${err}` });
        }
      });
    }
  });
});

// router.get("/table/:table", (req, res) => {
//   const table = req.params.table;
//   const column = req.params.column;
//   const string = req.params.string;
//   //   const sql = `SELECT * FROM ${table} WHERE ${column} LIKE '%${string}%';`;
//   const sql = `SELECT * FROM ${table} WHERE Title LIKE '%us%';`;
//   let results = [];
//   console.log("im here 1");
//   db.each(
//     sql,
//     (err, row) => {
//       console.log("im here 2");
//       results.push(row);
//     },
//     (err, rows) => {
//       if (err) {
//         res.status(404).json({ msg: "something's wrong" });
//       } else {
//         res.json(results);
//       }
//     }
//   );
// });

module.exports = router;
