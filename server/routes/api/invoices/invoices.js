const express = require("express");
const router = express.Router();

// variables
const db = require("../../../db");

// get selected invoices by ID's using db.each method
router.get("/:array", (req, res) => {
  const invoiceIds = req.params.array;
  const sql = `SELECT * FROM invoices WHERE InvoiceId IN (${invoiceIds});`;
  let results = [];
  db.each(
    sql,
    (err, row) => {
      results.push(row);
      if (results.length > 1)
        results.sort(function(a, b) {
          return (
            invoiceIds.indexOf(a.InvoiceId) - invoiceIds.indexOf(b.InvoiceId)
          );
        });
    },
    (err, rows) => {
      if (err) {
        res.status(404).json({ msg: `${err}` });
      } else {
        if (results.length === 0) {
          res.status(404).json({ msg: `Please enter at least one invoice ID` });
        } else {
          res.json(results);
        }
      }
    }
  );
});

module.exports = router;
