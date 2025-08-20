const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Signup
exports.signup = async (req, res) => {
  const { name, email, address, password, role } = req.body;
  
  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (result.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user with firstLogin set to 1 (true)
      db.query(
        'INSERT INTO users (name, email, address, password, role, firstLogin) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, address || '', hashedPassword, role || 'Customer', 1],
        (err, result) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Error creating user' });
          }
          
          // Create JWT token
          const token = jwt.sign(
            { 
              id: result.insertId, 
              email: email, 
              role: role || 'Customer',
              name: name
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: {
              id: result.insertId,
              name,
              email,
              role: role || 'Customer',
              firstLogin: 1
            }
          });
        }
      );
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Signin
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      
      if (!match) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      // Create JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        message: 'Logged in successfully',
        token,
        role: user.role,
        firstLogin: user.firstLogin,
        name: user.name,
        email: user.email,
        id: user.id
      });
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.setupComplete = (req, res) => {
  const { userId } = req.body;

  db.query(
    'UPDATE users SET firstLogin = 0 WHERE id = ?',
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Setup completed successfully' });
    }
  );
};


