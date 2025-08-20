const express = require("express");
const { saveStoreInfo,getStoreInfo ,getAllStores} = require("../controllers/storeController");
const verifyToken  = require("../middleware/authMiddleware");

const router = express.Router(); 

router.post("/store-info", verifyToken, saveStoreInfo);
router.get("/store-info", verifyToken, getStoreInfo);
router.get("/all-stores",verifyToken, getAllStores); 


module.exports = router;