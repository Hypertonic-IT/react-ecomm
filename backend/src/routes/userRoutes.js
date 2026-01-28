const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/AuthController');

router.get('/', getAllUsers);

module.exports = router;
