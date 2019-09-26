const express = require("express");
const sqlite3 = require("sqlite3");

const app = express();

const db = new sqlite3.Database("../db/chinook.db", err => {
  if (err) {
    return console.error(err.message);
  }
  const dbFileName = db.filename.match(/(\w+)\b\.(\w+)\b$/g);
  console.log(`Connected to the ${dbFileName} SQlites database.`);
});

const closeConnection = () => {
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
