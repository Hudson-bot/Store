const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


exports.signup = async (req, res) => {
  const { name, email, address, password, role } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (result.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hashing
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

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const query = "SELECT password FROM users WHERE id = ?";
    db.query(query, [userId], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
      db.query(updateQuery, [hashedPassword, userId], (updateErr) => {
        if (updateErr) {
          console.error("Update error:", updateErr);
          return res.status(500).json({ message: "Error updating password", error: updateErr });
        }

        return res.status(200).json({ message: "Password updated successfully" });
      });
    });
  } catch (error) {
    console.error("Password update error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
