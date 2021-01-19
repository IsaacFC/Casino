var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const { Client } = require('pg');


// var db = mysql.createConnection({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE
// });


var db = mysql.createConnection({
  host: 'us-cdbr-east-03.cleardb.com',
  user: 'b36dc85924c4ac',
  password: 'ab170533',
  database: 'heroku_9be335b690b07da'
});

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('MySQL conectado...');
    }
});





module.exports = db;
