const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')

// PATH: XXX/public

// Book
router.get('/book/:id', bookController.findBookById)


module.exports = router