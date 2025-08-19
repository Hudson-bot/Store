const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Signup
exports.signup = async (req, res) => {
  const { name, email, address, password, role } = req.body;
  try {
    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.length > 0) return res.status(400).json({ error: 'Email already exists' });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      db.query(
        'INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, address, hashedPassword, role],
        (err, result) => {
          if (err) return res.status(500).json({ error: err });
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Signin
exports.signin = async (req, res) => {
  const { email, password } = req.body; // changed from name to email
  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => { // query updated to email
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(400).json({ error: 'User not found' });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: 'Invalid password' });

      // Create JWT
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({ message: 'Logged in successfully', token });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

