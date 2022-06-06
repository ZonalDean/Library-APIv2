const jwt = require("jsonwebtoken")

module.exports = (payload) => jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN})