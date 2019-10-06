const express = require("express");
const router = express.Router();

// variables
const db = require("../../../db");

//  get single invoice by ID using db.get method
router.get("/:id", (req, res) => {
  const invoiceId = req.params.id;
  const sql = `SELECT * FROM invoices WHEREs InvoiceId = ?`;
  db.get(sql, [invoiceId], (err, row) => {
    if (err) {
      res.json({ msg: `${err.message}` });
    } else {
      if (row) {
        res.json(row);
      } else {
        res
          .status(400)
          .json({ msg: `No invoice with the ID of ${req.params.id}` });
      }
    }
  });
});

module.exports = router;
