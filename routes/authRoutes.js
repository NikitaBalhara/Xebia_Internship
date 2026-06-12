const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Simple secure dynamic routing for login and register
router.post('/login', authController.login);
router.post('/register', authController.register);

// Fallback profile endpoint if frontend requests it inside dashboard state
router.get('/me', authController.getMe);

// Safe mock endpoint for logout if frontend triggers it
router.post('/logout', (req, res) => {
    return res.status(200).json({ success: true, message: "Logged out successfully" });
});

module.exports = router;