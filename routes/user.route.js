var express = require('express')
const { check } = require('express-validator');
const { authorization, existsUserById } = require('../helpers/db-validators');
var router = express.Router()
var UserController = require('../controllers/users.controller');
//let upload = require('../middlewares/multer');
const Multer = require("multer");
const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

router.post('/registration', UserController.createUser)
router.post('/reset-password', UserController.resetPassword)
router.post('/login/', UserController.loginUser)
router.post('/image-upload', authorization, upload.single("my_img"), UserController.uploadImage)
router.get('/userById/:id',  [
  authorization,
  check('id', 'No es un ID válido').isMongoId()
] , UserController.getUserById);

// Add Authorization
//router.put('/update', Authorization, UserController.updateUser)
router.put('/update', [
  authorization,
  check('id').custom( existsUserById ),
], UserController.updateUser);
router.delete('/delete',  UserController.removeUser)
router.get('/users', UserController.getUsers)


// Export the Router
module.exports = router;
