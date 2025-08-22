const express = require("express");
const { 
  submitReview, 
  getStoreReviews, 
  getUserReview ,
  getOwnerStoreReviews
} = require("../controllers/reviewController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/reviews", verifyToken, submitReview);
router.get("/stores/:storeId/reviews", verifyToken, getStoreReviews);
router.get("/stores/:storeId/user-review", verifyToken, getUserReview);

router.get("/owner/reviews", verifyToken, getOwnerStoreReviews);

module.exports = router;