var express = require('express')
const { check } = require('express-validator');

var router = express.Router()
var UserController = require('../controllers/users.controller');
var Authorization = require('../auth/authorization');
//let upload = require('../middlewares/multer');
const Multer = require("multer");
const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

router.post('/registration', UserController.createUser)
router.post('/reset-password', UserController.resetPassword)
router.post('/login/', UserController.loginUser)
router.post('/image-upload',  upload.single("my_img"), UserController.uploadImage)
router.get('/userById/:id',  [
  check('id', 'No es un ID válido').isMongoId()
] , UserController.getUserById);

// Add Authorization
//router.put('/update', Authorization, UserController.updateUser)
router.put('/update',  [
  check('id', 'No es un ID válido').isMongoId()
] , UserController.updateUser);
//router.delete('/delete',  UserController.removeUser)
router.get('/users', UserController.getUsers)


// Export the Router
module.exports = router;
