require('dotenv').config;
const express = require("express");
const cors = require('cors')
const sequelize = require('sequelize')
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

// ROUTE IMPORT
const staffRoute = require('./routes/staffRoute')
const userRoute = require('./routes/userRoute')
const publicRoute = require('./routes/publicRoute')

const {Book, BookStock, Staff, Tag, User} = require('./models');

// MIDDLEWARE IMPORT

// ROUTES
app.use('/staff', staffRoute)
app.use('/user', userRoute)
app.use('/public', publicRoute)

// ERROR HANDLING
app.use(customError)
app.use(NotFound)

// sc.syncSQL('alter')

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
});