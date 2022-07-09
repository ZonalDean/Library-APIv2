const bs = require('../services/bookServices')
const bss = require('../services/stockServices')
const cs = require('../config/cs')
const { BookStock, Book, User } = require('../models')
const createError = require("../utils/createError");
const sequelize = require('sequelize')


exports.staffCycleUpdateStatus = async (req, res, next) => {
    try {
        const id = req.params.id;

        const stock = await bss.findById(id)

        if (stock.status === cs.OUT) {
            stock.set({
                status: cs.AVAILABLE,
                returnDate: null,
                userId: null
            })

            await stock.save()
        }

        if (stock.status === cs.READY) {
            stock.set({
                status: cs.OUT,
            })

            await stock.save()
        }

        if (stock.status === cs.RESERVED) {
            stock.set({
                status: cs.READY,
                returnDate: cs.RETURN_DATE
            })

            await stock.save()
        }

        res.status(201).json({ stock })
    } catch (err) {
        next(err)
    }
}

exports.deleteStockById = async (req, res, next) => {
    try {

        const stockId = req.params.stockid
        const bookId = req.params.bookid

        const stock = await bss.findById(stockId)

        await stock.destroy()

        const updatedStocks = await BookStock.findAll({
            where: {
                bookId
            }
        })

        res.status(201).json({ updatedStocks })
    } catch (err) {
        next(err)
    }
}

exports.addStock = async (req, res, next) => {
    try {

        const bookId = req.params.bookid

        await BookStock.create({
            status: "AVAILABLE",
            bookId: bookId,
        })

        const updatedStocks = await BookStock.findAll({
            where: {
                bookId
            }
        })

        res.status(201).json({ updatedStocks })
    } catch (err) {
        next(err)
    }
}

exports.staffFindByStatus = async (req, res, next) => {
    try {

        const stockStatus = req.params.status

        const stocks = BookStock.findAll({
            where: stockStatus,
            include: [
                {
                    model: User,
                    as: "User",
                    attributes: { firstName, lastName }
                },
                {
                    model: Book,
                    as: "Book"
                }
            ]
        })

        res.status(201).json({ stocks })

    } catch (err) {
        next(err)
    }
}

exports.getStocksMgmt = async (req, res, next) => {
    try {

        const reserved = await bss.findAllByStatus(cs.RESERVED)
        const ready = await bss.findAllByStatus(cs.READY)
        const out = await bss.findAllByStatus(cs.OUT)

        // console.log(reserved)

        const stocks = { reserved, ready, out }

        res.status(201).json({ stocks })
    } catch (err) {
        next(err)
    }
}

// USER
exports.userReserveBook = async (req, res, next) => {
    try {


        const bookId = req.params.id;

        const userId = req.user.id;

        const book = await Book.findOne({
            where: {
                id: bookId
            }
        })

        const stock = await BookStock.findOne({
            where: {
                bookId,
                status: cs.AVAILABLE,
            }
        });

        if (!stock) {
            createError('Book needs to be in stock to be reserved', 400)
        };

        if (stock.userId === userId) {
            createError('You already have resreved this book', 400)
        }

        if (stock) {
            stock.set({
                userId,
                status: cs.RESERVED
            });

            await stock.save();
        }

        ('\n\nruns reservebook')
        res.status(201).json({ stock })
    } catch (err) {
        next(err)
    }
}

exports.userGetMyStocks = async (req, res, next) => {
    try {

        const userId = req.user.id

        const status = req.params.status

        const myStocks = await bss.findMineByStatus(userId, status)

        const myBookByStock = await Book.findAll({
            include: {
                model: BookStock,
                where: {
                    userId,
                    status
                }
            }
        })

        // console.log(myBookByStock)

        res.status(201).json({ myStocks })

    } catch (err) {
        next(err)
    }

}

exports.userIsBookBorrow = async (req, res, next) => {
    try {

        const userId = req.user.id
        const bookId = req.params.bookid

        const isBorrowed = await BookStock.findAll({
            where: {
                userId,
                bookId
            }
        });

        // (isBorrowed)
        res.status(201).json({ isBorrowed })

    } catch (err) {
        next(err)
    }
}

// PUBLIC 
exports.getStockByBookId = async (req, res, next) => {
    try {

        const bookId = req.params.bookid

        const stocks = await BookStock.findAll({
            where: {
                id: bookId
            },
            include: [
                {
                    model: User,
                    as: "Users"
                }
            ]
        })

        res.status(201).json({ stocks })

    } catch (err) {
        next(err)
    }
}