const express = require('express');
const router = express.Router();
const { createShortUrl, redirectShortUrl, getStats } = require('../controllers/urlController');

router.post('/shorturls', createShortUrl);
router.get('/shorturls/:code', getStats);
router.get('/:code', redirectShortUrl);

module.exports = router;