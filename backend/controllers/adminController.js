const db = require("../config/db");

exports.getAdminDashboardStats = (req, res) => {
  const queries = {
    totalUsers: "SELECT COUNT(*) AS totalUsers FROM users",
    totalStores: "SELECT COUNT(*) AS totalStores FROM store_admin_info",
    totalRatings: "SELECT COUNT(*) AS totalRatings FROM reviews"
  };

  db.query(queries.totalUsers, (err, userResult) => {
    if (err) return res.status(500).json({ message: "Error fetching users count", error: err });

    db.query(queries.totalStores, (err, storeResult) => {
      if (err) return res.status(500).json({ message: "Error fetching stores count", error: err });

      db.query(queries.totalRatings, (err, ratingResult) => {
        if (err) return res.status(500).json({ message: "Error fetching ratings count", error: err });

        return res.status(200).json({
          totalUsers: userResult[0].totalUsers,
          totalStores: storeResult[0].totalStores,
          totalRatings: ratingResult[0].totalRatings
        });
      });
    });
  });
};

exports.getAllUsers = (req, res) => {
  const query = "SELECT id, name, email, address, role FROM users";
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching users", error: err });
    
    return res.status(200).json(results);
  });
};


exports.getAllStores = (req, res) => {
  const query = `
    SELECT 
      s.id, 
      s.name AS owner_name,
      u.email,
      s.store_name,
      s.address, 
      COALESCE(CAST(AVG(r.rating) AS DECIMAL(10,1)), 0) as average_rating,
      COUNT(r.id) as total_reviews
    FROM store_admin_info s
    LEFT JOIN users u ON s.user_id = u.id
    LEFT JOIN reviews r ON s.user_id = r.store_id
    GROUP BY s.id, s.name, u.email, s.store_name, s.address
    ORDER BY s.store_name
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error in getAllStores:", err);
      return res.status(500).json({ 
        message: "Error fetching stores", 
        error: err.message 
      });
    }
    
    // Ensure average_rating is always a number
    const formattedResults = results.map(store => ({
      ...store,
      average_rating: Number(store.average_rating) || 0,
      total_reviews: Number(store.total_reviews) || 0
    }));
    
    return res.status(200).json(formattedResults);
  });
};