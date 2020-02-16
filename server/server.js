const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use(bodyParser.json());

// API Routes

// invoice route
app.use("/api/invoice", require("./routes/api/invoice/invoice"));

// invoices route
app.use("/api/invoices", require("./routes/api/invoices/invoices"));

// genres route
app.use("/api/genres", require("./routes/api/genres/genres"));

// cats route
app.use("/api/cats", require("./routes/api/cats/cats"));

// chinook route
app.use("/api/chinook", require("./routes/api/chinook/chinook"));
