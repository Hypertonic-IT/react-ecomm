const express = require('express');
const router = express.Router();
const { protect, admin, checkRole } = require('../middleware/authMiddleware');
const { getAllUsers, deleteUser, createStaff } = require('../controllers/AuthController');

router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);
router.post('/staff', protect, checkRole(['super_admin']), createStaff);

module.exports = router;
