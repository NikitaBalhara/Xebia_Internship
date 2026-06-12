const express = require('express');
const router = express.Router();
// Notification controller functions ka tight integration
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getNotifications);
router.route('/:id/read').put(protect, markAsRead);

module.exports = router;