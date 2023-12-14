const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { isClaseValid,
        existsClaseById,
        existsClaseByStatus,
        existsUserById } = require('../helpers/db-validators');

const { claseContratadaGet,
        getListaClaseContratada,
        claseContratadaCreate,
        statusClaseContratadaUpdate } = require('../controllers/claseContratada.controllers');
        
const router = Router();

router.post('/contratar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('telefono', 'El número de telefono es obligatorio').not().isEmpty(),
    check('mail', 'El mail es obligatorio').not().isEmpty(),
    check('horario', 'El horario es obligatorio').not().isEmpty(),
    check('mensaje', 'El mensaje es obligatorio').not().isEmpty(),
    check('nombreAlumno', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
] , claseContratadaCreate);

router.get('/ver-clase-contratada/:id',  [
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
] , claseContratadaGet);

router.get('/lista-clases-contratada/:id',  [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsUserById ),
    validateFields
] , getListaClaseContratada);

router.put('/lista-clases-contratada-status/:id',  [
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
] , statusClaseContratadaUpdate);

module.exports = router;