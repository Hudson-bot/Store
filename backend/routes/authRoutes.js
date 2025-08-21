const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/authController');
const { setupComplete } = require('../controllers/authController');
const { updatePassword } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/signin', signin);
router.patch('/setupComplete', setupComplete);
router.put("/update-password", verifyToken, updatePassword);

module.exports = router;
