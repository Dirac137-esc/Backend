const router = require('express').Router();
const authJwt = require('../middleware/authJwt');
const checkRole = require('../middleware/verifyRole');
const controller = require('../controllers/menu.controller');
router.get('/', authJwt, controller.list);

router.post('/', authJwt, checkRole('admin'), controller.create);

router.get('/this-week', authJwt, controller.thisWeek);

router.put('/:id', authJwt, checkRole('admin'), controller.update);

router.delete('/:id', authJwt, checkRole('admin'), controller.remove);

module.exports = router;
