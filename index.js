const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { body, validationResult } = require('express-validator');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only images allowed'), false);
};
const upload = multer({ storage, fileFilter });
app.post(
  '/api/register',
  upload.single('photo'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('age').isInt({ min: 1 }).withMessage('Age must be a valid number'),
    body('dob').notEmpty().isDate().withMessage('DOB must be valid'),
    body('mobile').isMobilePhone().withMessage('Invalid mobile number'),
    body('email').isEmail().withMessage('Invalid email'),
    body('pincode').isPostalCode('IN').withMessage('Invalid pincode')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {
      name, age, dob, gender, mobile,
      email, address, state, pincode,
      occupation, marital_status
    } = req.body;

    const photo = req.file ? req.file.filename : null;

    const sql = `INSERT INTO users 
      (name, age, dob, gender, mobile, email, address, state, pincode, occupation, marital_status, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
      name, age, dob, gender, mobile, email, address, state, pincode, occupation, marital_status, photo
    ], (err, result) => {
      if (err) {
        console.error('Insert Error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json({ message: 'Registration successful' });
    });
  }
);
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
