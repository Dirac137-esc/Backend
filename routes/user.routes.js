const router = require('express').Router();
const authJwt = require('../middleware/authJwt');
const ctl = require('../controllers/user.controller');
const checkRole = require("../middleware/verifyRole");

router.get('/', authJwt,checkRole('admin'), ctl.list);

router.get('/profile', authJwt, ctl.getProfile);

module.exports = router;
