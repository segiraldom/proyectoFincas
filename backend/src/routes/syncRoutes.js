const express = require('express');
const { syncBatch } = require('../controllers/syncController');

const router = express.Router();

router.post('/batch', syncBatch);

module.exports = router;
