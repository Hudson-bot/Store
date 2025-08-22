const db = require("../config/db");


exports.saveStoreInfo = (req, res) => {
  const { name, storeName, address, phone, storeType } = req.body;
  const userId = req.user.id; 

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


exports.getAllStores = (req, res) => {
  const query = `
    SELECT 
      user_id AS id,
      store_name AS name,
      store_type AS type,
      COALESCE(rating, 0) AS rating,
      COALESCE(review_count, 0) AS review_count
    FROM store_admin_info 
    ORDER BY rating DESC, review_count DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching stores", error: err });
    }
    
    return res.status(200).json(results);
  });
};