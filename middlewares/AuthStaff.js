require('dotenv').config();
const jwt = require('jsonwebtoken');
const createError = require("../utils/createError");
const { Staff } = require('../models');
// jsonwebtoken


module.exports = async (req, res, next) => {
    try {

        // EXTRACT authorization FROM HEADERS & CHECK IF VALID
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith('Bearer')) {
            createError('You are unautherized', 401)
        };

        // EXTRACT TOKEN FROM authorization & CHECK IF TOKEN IS REAL
        const token = authorization.split(' ')[1]
        if (!token) {
            createError('You are unautherized', 401)
        };

        // PREPARE PAYLOAD
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        
        // find staff AND exclude password from payload
        const staff = await Staff.findOne({ where: { id: payload.id },
        attributes: {
            exclude: ['password']
        } })
        // check if staff is valid
        if (!staff) {
            createError('You are unautherized', 401)
        };

        // PREPARE USER TO BE SENT TO ROUTE
        req.user = staff;
        next()
    } catch (err) {
        next(err)
    }
}