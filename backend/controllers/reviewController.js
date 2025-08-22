const db = require("../config/db");

exports.submitReview = (req, res) => {
  const { storeId, rating, comment } = req.body;
  const customerId = req.user.id;
  const customerName = req.user.name;

  const checkQuery = `
    SELECT id FROM reviews 
    WHERE store_id = ? AND customer_id = ?
  `;

  db.query(checkQuery, [storeId, customerId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error checking review", error: err });
    }

    if (results.length > 0) {
      const updateQuery = `
        UPDATE reviews 
        SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP
        WHERE store_id = ? AND customer_id = ?
      `;

      db.query(updateQuery, [rating, comment, storeId, customerId], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Error updating review", error: err });
        }
        
        updateStoreRating(storeId);
        return res.status(200).json({ message: "Review updated successfully" });
      });
    } else {
      const insertQuery = `
        INSERT INTO reviews (store_id, customer_id, customer_name, rating, comment)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(insertQuery, [storeId, customerId, customerName, rating, comment], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Error submitting review", error: err });
        }
        
        updateStoreRating(storeId);
        return res.status(201).json({ message: "Review submitted successfully" });
      });
    }
  });
};

exports.getStoreReviews = (req, res) => {
  const { storeId } = req.params;

  const query = `
    SELECT * FROM reviews 
    WHERE store_id = ? 
    ORDER BY created_at DESC
  `;

  db.query(query, [storeId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching reviews", error: err });
    }
    
    return res.status(200).json(results);
  });
};

exports.getUserReview = (req, res) => {
  const { storeId } = req.params;
  const customerId = req.user.id;

  const query = `
    SELECT * FROM reviews 
    WHERE store_id = ? AND customer_id = ?
  `;

  db.query(query, [storeId, customerId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching user review", error: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "No review found" });
    }
    
    return res.status(200).json(results[0]);
  });
};

const updateStoreRating = (storeId) => {
  const query = `
    UPDATE store_admin_info 
    SET 
      rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM reviews 
        WHERE store_id = ?
      ),
      review_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE store_id = ?
      )
    WHERE user_id = ?
  `;

  db.query(query, [storeId, storeId, storeId], (err, result) => {
    if (err) {
      console.error("Error updating store rating:", err);
    }
  });
};


exports.getOwnerStoreReviews = (req, res) => {
  const ownerId = req.user.id; 

  const query = `
    SELECT r.id, r.customer_name, r.rating, r.comment, r.created_at 
    FROM reviews r
    INNER JOIN store_admin_info s ON r.store_id = s.user_id
    WHERE s.user_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(query, [ownerId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error fetching store reviews", error: err });
    }

    return res.status(200).json(results);
  });
};