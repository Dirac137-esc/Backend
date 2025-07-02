const router = require('express').Router();
const authJwt = require('../middleware/authJwt');
const controller = require('../controllers/user.controller');
const checkRole = require("../middleware/verifyRole");

router.get('/', authJwt,checkRole('admin'), controller.list);

router.get('/profile', authJwt, controller.getProfile);

router.put('/:id', authJwt, controller.updateUser);


module.exports = router;
/*
{
    "name": "Updated Name",
    "email": "newemail@example.com",
    "phone": "88880000",
    "address": "UB",
    "oldPassword": "123456",
    "password": "newpassword123"
}
*/

