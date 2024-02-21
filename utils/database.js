// const mysql = require("mysql2");

// const pool = mysql.createPool({
//     host:"localhost",
//     user:"root",
//     database:"node-complete",
//     password:"admin"
// })

// module.exports = pool.promise(); //promise() is a method that returns a promise

//with sequelize

const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "admin", {
	dialect: "mysql",
	host: "localhost",
}); //db bnaneme, username, password then //setup db connection

module.exports = sequelize;
