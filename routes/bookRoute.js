const express = require('express');
const router = express.Router();
const AuthStaff = require('../middlewares/AuthStaff')
const bookController = require('../controllers/bookController')

// PUBLIC
// STAFF
router.post('/create', AuthStaff, bookController.createBook)

// USER


module.exports = router