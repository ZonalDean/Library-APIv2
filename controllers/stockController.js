const bs = require('../services/bookServices')
const bss = require('../services/stockServices')
const ts = require('../services/tagServices')
const sc = require('../sc')
const cs = require('../config/cs')
const { Book, Tag, BookStock } = require('../models')
const createError = require("../utils/createError");
const sequelize = require('sequelize')

// STAFF
exports.staffFindByStatus = async (req, res, nect) => {
    try {

        const status = req.params.status 

        const stock = await bss.findAllByStatus(status)

        res.status(201).json({ message: `all ${status} stocks`, stock })

    } catch (err) {
        next(err)
    }
}

exports.staffCycleUpdateStatus = async (req,res,next) => {
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
        
        res.status(201).json({stock})
    } catch (err) {
        next(err)
    }
}

// USER
exports.userReserveBook = async (req,res,next) => {
    try {

        const bookId = req.params.id;

        const userId = req.user.id;

        const book = await bs.findBookById(bookId);

        const stock = await BookStock.findOne({
            where: {
                bookId: book.id,
                status: cs.AVAILABLE,
            }
        });

        console.log(JSON.parse(JSON.stringify({ stock })))
        if (!stock) {
            createError('Book needs to be in stock to be reserved', 400)
        };
        
        if (stock) {
            stock.set({
                userId,
                status: cs.RESERVED
            });
            
            await stock.save();
        }

        res.status(201).json({ stock })
    } catch (err) {
        next(err)
    }
}