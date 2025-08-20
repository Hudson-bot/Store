const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/authController');
const { setupComplete } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/signin', signin);
router.patch('/setupComplete', setupComplete);

module.exports = router;
