const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController')
const bookController = require('../controllers/bookController')
const stockController = require('../controllers/stockController')
const AuthStaff = require('../middlewares/AuthStaff');
const Upload = require('../middlewares/Upload');


// PATH: XXX/staff

// Auth
router.post('/login', staffController.staffLogin)
router.post('/newstaff', staffController.newStaff)
router.get('/me', AuthStaff, staffController.getMe)


// Book
router.post('/newbook', AuthStaff, Upload.single('coverPhoto'), bookController.staffCreateBook)
router.post('/newbook/:id', AuthStaff, bookController.getBookData)
router.patch('/updatebook/:id', AuthStaff, Upload.single('coverPhoto'), bookController.staffUpdateBook)
router.delete('/deletebook/:id', AuthStaff, Upload.single('coverPhoto'), bookController.staffDeleteBookAndStock)
router.get('/booksearch/:search/:tag', AuthStaff, bookController.staffSearch)
router.get('/book/:id', AuthStaff, bookController.getBookTagsAndStock)

// Tag
router.patch('/booktags/:bookid/:tagid', AuthStaff, bookController.staffDeleteBookTag)
router.patch('/booktags/add/:bookid/:tagname', AuthStaff, bookController.staffAddTag)

// Stock
// router.get('/allstock/:status', AuthStaff, stockController.staffFindByStatus)
router.get('/allstock/:status', AuthStaff, stockController.getStocksMgmt)
router.get('/bookstocks/:bookid', AuthStaff, stockController.getStockByBookId)
router.patch('/stock/:id', AuthStaff, stockController.staffCycleUpdateStatus)
router.delete('/stock/:stockid/:bookid', AuthStaff, stockController.deleteStockById)
router.post('/stock/:bookid', AuthStaff, stockController.addStock)



module.exports = router