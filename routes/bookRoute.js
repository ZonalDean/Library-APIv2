const express = require('express');
const router = express.Router();
const AuthStaff = require('../middlewares/AuthStaff')
const AuthUser = require('../middlewares/AuthUser')
const bookController = require('../controllers/bookController')

// PUBLIC
router.get('/:id', bookController.findBookById)
// STAFF
router.post('/create', AuthStaff, bookController.createBook)

// USER
router.post('/:id/reserve', AuthUser,bookController.reserveBook)

module.exports = router