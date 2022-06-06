require('dotenv').config;
const express = require("express");
const cors = require('cors')
const {sequelize} = require('sequelize')
const morgan = require('morgan')

// BASICS
const app = express();
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// IMPORTS
const sc = require('./sc')

const NotFound = require('./middlewares/NotFound');
const customError = require('./middlewares/customError');

// MIDDLEWARE IMPORT

// ROUTES

// ERROR HANDLING
app.use(customError)
app.use(NotFound)

// sc.syncSQL('')

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
});