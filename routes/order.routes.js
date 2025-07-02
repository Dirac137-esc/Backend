const router = require('express').Router();
const authJwt = require('../middleware/authJwt');
const checkRole = require('../middleware/verifyRole');
const controller = require('../controllers/order.controller');

router.post('/', authJwt, controller.create);

router.get('/', authJwt, checkRole('admin'), controller.list);

router.put('/:id', authJwt, checkRole('admin'), controller.updateStatus);

router.delete('/:id', authJwt, checkRole('admin'), controller.remove);

module.exports = router;
