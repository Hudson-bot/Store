const express = require("express");
const router = express.Router();
const { getAdminDashboardStats,getAllUsers,getAllStores } = require("../controllers/adminController");
const  verifyToken  = require("../middleware/authMiddleware"); 

router.get("/dashboard-stats", verifyToken, getAdminDashboardStats);
router.get("/users", verifyToken, getAllUsers);
router.get("/stores", verifyToken, getAllStores);

module.exports = router;