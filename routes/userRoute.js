const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const AuthUser = require('../middlewares/AuthUser')

router.post('/login', userController.userLogin)
router.post('/register', userController.userRegister)

module.exports = router