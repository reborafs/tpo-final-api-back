const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { isClaseValid,
        existsClaseById,
        existsClaseByStatus } = require('../helpers/db-validators');

const { claseGet,
        listaClaseGet,
        claseCreate,
        claseUpdate,
        claseDelete } = require('../controllers/clase.controllers');



const router = Router();

router.get('/ver-clase/:id',  [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsClaseById ),
    check('id').custom( existsClaseByStatus ),
    validateFields
] , claseGet);

router.get('/catalogo', listaClaseGet);

router.post('/crear-clase', [
    check('title', 'El nombre es obligatorio').not().isEmpty(),
    check('profesorName', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'El nombre es obligatorio').not().isEmpty(),
    check('price', 'El nombre es obligatorio').not().isEmpty(),
    check('imgUrl', 'El nombre es obligatorio').not().isEmpty(),
    check().custom((value, { req }) => isClaseValid(req.body)),
    validateFields
] , claseCreate);

router.put('/actualizar-clase/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsClaseById ),
    check('title', 'El nombre es obligatorio').not().isEmpty(),
    check('profesorName', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'El nombre es obligatorio').not().isEmpty(),
    check('price', 'El nombre es obligatorio').not().isEmpty(),
    check('imgUrl', 'El nombre es obligatorio').not().isEmpty(),
    check().custom((value, { req }) => isClaseValid(req.body)),
    validateFields
] , claseUpdate);

router.delete('/borrar-clase/:id', [ 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsClaseById ),
    validateFields
] , claseDelete);

module.exports = router;