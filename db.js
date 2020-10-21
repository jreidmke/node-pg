// const { Client } = require("pg");

// let DB_URI;

// // If we're running in test "mode", use our test db
// // Make sure to create both databases!
// if (process.env.NODE_ENV === "test") {
//   DB_URI = "postgresql:///usersdb_test";
// } else {
//   DB_URI = "postgresql:///usersdb";
// }

// let db = new Client({
//   connectionString: DB_URI
// });

// db.connect();

// module.exports = db;

const { Client } = require('pg');//here we are pulling Client out of the PG object

let DB_URI; //create var to store URI which will change depending on destination

if(process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///usersdb_test" //remember, you'll have to change this
} else {
  DB_URI = "postgresql:///usersdb";
}

let db = new Client({ //instantiate Client object
  connectionString: DB_URI //set connectionString property equal to DB_URI
});

db.connect() //connect the db

module.exports = db; //export it