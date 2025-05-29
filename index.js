const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'), false);
    cb(null, true);
  }
});

app.post('/api/register', upload.single('photo'), [
  body('name').notEmpty(),
  body('age').isInt({ min: 1 }),
  body('dob').isDate(),
  body('mobile').isMobilePhone(),
  body('email').isEmail(),
  body('pincode').isPostalCode('IN')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, age, dob, gender, mobile, email, address, state, pincode, occupation, marital_status } = req.body;
  const photo = req.file ? req.file.filename : null;

  const sql = `INSERT INTO users (name, age, dob, gender, mobile, email, address, state, pincode, occupation, marital_status, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [name, age, dob, gender, mobile, email, address, state, pincode, occupation, marital_status, photo];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Registration successful' });
  });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
