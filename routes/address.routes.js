const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');


router.post('/search-address', addressController.searchAddress);

module.exports = router;
