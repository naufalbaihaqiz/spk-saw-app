const express = require('express');
const router = express.Router();
const HasilController = require('../controllers/HasilController');

router.get('/', HasilController.hitungSAW);

module.exports = router;