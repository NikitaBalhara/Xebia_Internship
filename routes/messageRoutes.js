const express = require('express');
const { sendMessage, getMessages, getInboxUsers } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/inbox/list', getInboxUsers);
router.get('/:userId', getMessages);

module.exports = router;
