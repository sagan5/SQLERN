const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// API Routes

// invoices route
app.use("/api/invoices", require("./routes/api/invoices/invoices"));

// geners route
app.use("/api/genres", require("./routes/api/genres/genres"));

// cats route
app.use("/api/cats", require("./routes/api/cats/cats"));
