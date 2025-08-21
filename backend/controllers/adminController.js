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

// Get all users
exports.getAllUsers = (req, res) => {
  const query = "SELECT id, name, email, address, role FROM users";
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching users", error: err });
    
    return res.status(200).json(results);
  });
};

// Get all stores
exports.getAllStores = (req, res) => {
  const query = `
    SELECT s.id, s.name, s.email, s.address, AVG(r.rating) as rating
    FROM store_admin_info s
    LEFT JOIN reviews r ON s.id = r.store_id
    GROUP BY s.id
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching stores", error: err });
    
    return res.status(200).json(results);
  });
};