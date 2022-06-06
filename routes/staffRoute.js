const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController')
const AuthStaff = require('../middlewares/AuthStaff')

router.post('/login', staffController.staffLogin)
router.post('/newstaff',  staffController.newStaff)

module.exports = router