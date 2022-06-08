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
router.post('/newstaff',  staffController.newStaff)

// Book
router.post('/newbook', AuthStaff, Upload.single('coverPhoto'), bookController.staffCreateBook)
router.patch('/updatebook/:id', AuthStaff, Upload.single('coverPhoto'), bookController.staffUpdateBook)
router.delete('/deletebook/:id', AuthStaff, Upload.single('coverPhoto'), bookController.staffDeleteBookAndStock)

// Stock
router.get('/allstock/:status', AuthStaff, stockController.staffFindByStatus)
router.patch('/updatebook/:id', AuthStaff, stockController.staffCycleUpdateStatus)


module.exports = router