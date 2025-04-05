const express = require('express');
const router = express.Router();
const { createMessage, getMessages, getPendingMessages, updateMessageStatus } = require('../controllers/messageController');

router.post('/', createMessage);
router.get('/', getMessages);
router.get('/pending', getPendingMessages);
router.put('/update/:id', updateMessageStatus);

module.exports = router;