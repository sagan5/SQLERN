const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "../db/chinook.db",
  // no delete statements allowed
  // sqlite3.OPEN_READONLY,

  sqlite3.OPEN_READWRITE,

  err => {
    if (err) {
      return console.error(err.message);
    }
    const dbFileName = db.filename.match(/(\w+)\b\.(\w+)\b$/g);
    console.log(`Connected to the ${dbFileName} SQlite database.`);
  }
);

const closeDB = db => {
  db.close(err => {
    if (err) {
      return console.error(err.message);
    }
    const dbFileName = db.filename.match(/(\w+)\b\.(\w+)\b$/g);
    console.log(
      `Closed connection to the ${dbFileName} SQlite database connection.`
    );
  });
};

// module.exports = closeDB();

module.exports = db;
