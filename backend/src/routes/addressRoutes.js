const {
    getAllAddresses,
    addAddress,
    updateAddress,
    deleteAddress
} = require('../controllers/AddressController');

const express = require('express');
const router = express.Router();

router.get('/', getAllAddresses);
router.post('/', addAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;
