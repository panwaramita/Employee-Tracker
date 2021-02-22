//added the mysql module
const mysql = require('mysql');
//connection to the database
var connection ={
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "090981",
    database: "office_db"
};
module.exports.db_config=connection;