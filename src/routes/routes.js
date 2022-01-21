var express = require("express")
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController =  require("../controllers/UsersController");
var adminAuth = require("../middleware/AdminAuth");

//ROUTES
router.get('/', HomeController.index);
router.post('/user', UserController.createUser);
router.get('/user', adminAuth ,UserController.index);
router.get('/user/:id', UserController.findUser);
router.put('/user', UserController.ediUser);
router.delete('/user/:id', UserController.deleteUser);
router.post('/recoverpassword', UserController.recoverPassword)
router.post('/changepassword', UserController.changePassword);
router.post('/login', UserController.login);

module.exports = router;