const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController')
const bookController = require('../controllers/bookController')
const stockController = require('../controllers/stockController')
const AuthStaff = require('../middlewares/AuthStaff')


// PATH: XXX/staff

// Auth
router.post('/login', staffController.staffLogin)
router.post('/newstaff',  staffController.newStaff)

// Book
router.post('/newbook', AuthStaff, bookController.staffCreateBook)

// Stock
router.post('/allstock/:status', AuthStaff, stockController.staffFindByStatus)
router.post('/updatestock/:id', AuthStaff, stockController.staffCycleUpdateStatus)

module.exports = router