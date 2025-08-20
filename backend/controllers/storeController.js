const db = require("../config/db");

// Save store admin info
exports.saveStoreInfo = (req, res) => {
  const { name, storeName, address, phone, storeType } = req.body;
  const userId = req.user.id; // comes from JWT after login

  const query = `
    INSERT INTO store_admin_info (user_id, name, store_name, address, phone, store_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [userId, name, storeName, address, phone, storeType], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error saving store info", error: err });
    }
    return res.status(201).json({ message: "Store info saved successfully" });
  });
};

// Get store admin info
exports.getStoreInfo = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT * FROM store_admin_info WHERE user_id = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching store info", error: err });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Store info not found" });
    }
    
    return res.status(200).json(result[0]);
  });
};