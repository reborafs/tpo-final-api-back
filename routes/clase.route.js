const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { isClaseValid,
    existsClaseById,
    existsClaseByStatus,
    existsUserById } = require('../helpers/db-validators');

const { claseGet,
    listaClaseGet,
    claseCreate,
    claseUpdate,
    claseDelete,
    misClaseGet,
    claseContratadaGet,
    comentarioUpdateParam,
    uploadImage,
    comentarioCreate,
    listaComentariosGet } = require('../controllers/clase.controllers');

const Multer = require("multer");
const storage = new Multer.memoryStorage();
const upload = Multer({
    storage,
});


const router = Router();

router.get('/ver-clase/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existsClaseById),
    check('id').custom(existsClaseByStatus),
    validateFields
], claseGet);

router.get('/catalogo', listaClaseGet);

router.post('/crear-clase', [
    check('title', 'El nombre es obligatorio').not().isEmpty(),
    check('profesorId', 'No es un ID válido').isMongoId(),
    check('category', 'categoria es obligatoria').not().isEmpty(),
    check('tipoClase', 'El tipo clase es obligatorio').not().isEmpty(),
    check('frecuencia', 'La frecuencia es obligatorio').not().isEmpty(),
    check('duracion', 'La duracion es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatorio').not().isEmpty(),
    check('price', 'El precio es obligatorio').not().isEmpty(),
    check().custom((value, { req }) => isClaseValid(req.body)),
    validateFields
], claseCreate);

router.put('/actualizar-clase/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existsClaseById),
    check('title', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'El nombre es obligatorio').not().isEmpty(),
    check('tipoClase', 'El tipo clase es obligatorio').not().isEmpty(),
    check('frecuencia', 'La frecuencia es obligatorio').not().isEmpty(),
    check('duracion', 'La frecuencia es obligatorio').not().isEmpty(),
    check('description', 'El nombre es obligatorio').not().isEmpty(),
    check('price', 'El nombre es obligatorio').not().isEmpty(),
    check('imgUrl', 'El nombre es obligatorio').not().isEmpty(),
    check().custom((value, { req }) => isClaseValid(req.body)),
    validateFields
], claseUpdate);

router.delete('/borrar-clase/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existsClaseById),
    validateFields
], claseDelete);

router.get('/mis-clases/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
], misClaseGet);

router.put('/actualizar-comment/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('statusComentario', 'El statusComentario es obligatorio').not().isEmpty(),
    validateFields
], comentarioUpdateParam);

router.post('/create-comment', [
    check('claseId', 'No es un ID válido').isMongoId(),
    check('claseContratadaId', 'No es un ID válido').isMongoId(),
    check('comentarioInfo', 'El comentarioInfo es obligatorio').not().isEmpty(),
    check('calificacion', 'El calificacion es obligatorio').not().isEmpty(),
    check('autor', 'El autor es obligatorio').not().isEmpty(),
    validateFields
], comentarioCreate);

router.get('/lista-comentarios', listaComentariosGet);

router.post('/image-upload', upload.single("my_img"), uploadImage)

module.exports = router;