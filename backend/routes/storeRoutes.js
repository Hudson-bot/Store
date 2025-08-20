const express = require("express");
const { saveStoreInfo,getStoreInfo } = require("../controllers/storeController");
const verifyToken  = require("../middleware/authMiddleware");

const router = express.Router(); 

router.post("/store-info", verifyToken, saveStoreInfo);
router.get("/store-info", verifyToken, getStoreInfo);
module.exports = router;