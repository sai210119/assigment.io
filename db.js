const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',       // leave blank if you haven't set a password
  database: 'registration_db'
});
