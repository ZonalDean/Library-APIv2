const express = require('express');
const router = express.Router();
const AuthStaff = require('../middlewares/AuthStaff')
const AuthUser = require('../middlewares/AuthUser')
const bookController = require('../controllers/bookController')

// PUBLIC
router.get('/:id', bookController.findBookById)
// STAFF
router.post('/create', AuthStaff, bookController.staffCreateBook)

router.post('/stock/status/:status', AuthStaff, bookController.staffFindStockByStatus)
router.post('/stock/update/:id', AuthStaff, bookController.staffUpdateStockStatus)

// USER
router.post('/:id/reserve', AuthUser, bookController.userReserveBook)

module.exports = router