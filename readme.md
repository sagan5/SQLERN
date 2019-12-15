# SQLITE3, EXPRESS, REACT AND NODE full-stack project

### Project is created for learning purposes

## 1. Create project's folder structure:

     SQLERN (main project folder)
      |----> client (fron-end folder)
      |----> server (back-end folder)
      |----> db (database folder)

## 2. Initialize .git repository in SQLERN folder and create .gitignore file

    $ git init
    $ touch .gitignore
    $ echo node_modules > .gitignore
    $ echo client/node_modules >> .gitignore
    $ echo server/node_modules >> .gitignore

## 3. Create react app in client folder

    $ create-react-app client

## 4. Delete unnecessary files in client folder:

    .gitignore
    readme.md

## 5. Prepare react files for development

## 6. Initial commit

## 7. Add a button (to test react)

## 8. Add axios to the project (client)

    $ npm install axios --save

## 9. Add express to the project (server)

    $ npm install express

## 10. Add sqlite3 to the project (server)

    $ npm install sqlite3

## 11. Create server.js file in server folder and something

    $ npm touch server.js

## 12. Copy example database file chinook.db to db folder

## 13. Add concurrently to the project (to start client and server at the same time) (main)

    $ npm install concurrently

## 14. Add nodemon to the project (for automatic server restart) (server)

    $ npm install --save-dev nodemon

## 15. Edit package.json files and add scripts

    main folder

    "start": "concurrently \"cd server && npm start\" \"cd client && npm start\""

    server

    "start": "nodemon ./server.js localhost 3000"

## 16. Start client and server (main folder)

    $ npm start

## 17. Add GET API's with different db methods

## 18. Add interface/error handling for GET methods
