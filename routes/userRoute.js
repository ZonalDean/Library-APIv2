const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const stockController = require('../controllers/stockController')
const AuthUser = require('../middlewares/AuthUser')

// PATH: XXX/user

// Auth
router.post('/login', userController.userLogin)
router.post('/register', userController.userRegister)

// Book


// Stock
router.post('/reservebook/:id', AuthUser, stockController.userReserveBook)

module.exports = router