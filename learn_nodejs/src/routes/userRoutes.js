const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const userController = require('../controllers/useControllers');
const checkTokenExpiration = require('../middleware/checkToken');
const checkUser = require("../middleware//checkUser")


router.get('/users', checkTokenExpiration, checkUser("admin"), userController.getUsers);
router.post('/login', userController.Login);
router.post('/uploadsImg',userController.upLoadImge)

module.exports = router;
