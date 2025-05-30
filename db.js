const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // if using XAMPP default
  database: 'registration_db'
});

connection.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('✅ MySQL connected');
});

module.exports = connection;
