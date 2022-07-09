const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const stockController = require('../controllers/stockController')

// PATH: XXX/public

// Book
router.get('/book/:id', bookController.findBookById)
router.get('/booksearch/:search/:tag', bookController.searchBook)
router.get('/bookdisplay/:tag', bookController.findBooksByTag)

router.get('/getalltags', bookController.getAllTags)

// router.get('/stock/:id', stockController.)

module.exports = router