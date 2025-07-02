const router = require('express').Router();
const authJwt = require('../middleware/authJwt');
const checkRole = require('../middleware/verifyRole');
const controller = require('../controllers/food.controller');

router.get('/', authJwt, controller.list);

router.post('/', authJwt, checkRole('admin'), controller.create);

router.put('/:id', authJwt, checkRole('admin'), controller.update);

router.delete('/:id', authJwt, checkRole('admin'), controller.remove);

router.post('/:id/ingredients', authJwt, checkRole('admin'), controller.addIngredient);

module.exports = router;
