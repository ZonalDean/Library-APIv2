const bs = require('../services/bookServices')
const bss = require('../services/stockServices')
const ts = require('../services/tagServices')
const sc = require('../sc')
const cs = require('../config/cs')
const { Book, Tag, BookStock } = require('../models')
const createError = require("../utils/createError");
const { sequelize, Op } = require('sequelize')

// Staff
exports.staffCreateBook = async (req, res, next) => {
    try {
        const { name, authorName, publishDate, tags, number } = req.body;

        // #1 input validation        
        if (!name) {
            createError('name required', 400)
        } if (!authorName) {
            createError('author first name required', 400)
        } if (!publishDate) {
            createError('publishing date is required', 400)
        } if (!number) {
            createError('number of books is required', 400)
        }

        // #2 Check if isBookDupe

        const isBookDupe = await Book.findOne({
            where: {
                name: name
            }
        });

        if (isBookDupe) {
            createError('This book already exists, or name has been used', 400)
        }

        const newBook = await Book.create({
            name: name,
            authorName,
            publishDate,
            staffId: req.user.id
        });

        const tagLength = tags.length

        // For loop creating and adding tags
        for (i = 0; i < tagLength; i++) {

            const tagCurrent = tags.pop()
            console.log(tagCurrent)

            const isTagDupe = await Tag.findOne({
                where: {
                    name: tagCurrent
                }
            });

            if (isTagDupe) {
                await newBook.addTag(isTagDupe)
            }

            if (!isTagDupe) {
                const newTag = await Tag.create({
                    name: tagCurrent
                });
                await newBook.addTag(newTag)
            }

        };

        const result = await Book.findOne({
            where: {
                name
            },
            include: [
                { model: Tag },
                { model: BookStock }
            ]
        })


        // For loop creating IndivdualBooks based on number
        for (let i = 0; i < number; i++) {
            await BookStock.create({
                bookId: newBook.id,
                status: cs.AVAILABLE
            })
        };


        res.status(201).json({ message: 'books created', result })
    } catch (err) {
        next(err)
    }
}

// User

// Public
exports.findBookById = async (req, res, next) => {
    try {
        const id = req.params.id

        const book = await Book.findOne({
            attributes: ["name", "authorName", "publishDate", "coverPhoto"],
            where: {
                id,
                '$BookStocks.status$': cs.AVAILABLE
            },
            include: {
                model: BookStock,
                as: 'BookStocks',
                attributes: ["status", "id"],
                // separate: true,
                // limit: 2
            },
        });
    
        if (!book) {
            createError('Book with this ID does not exist', 400)
        }
    
        res.status(201).json({ book })
    } catch (err) {
        next(err)
    }
    
}

exports.searchBook = async (req, res, next) => {
    try {

        let { text, author, tag} = req.body

        const foundBooks = await Book.findAll({
            where: {
                [Op.or]: [
                    {name: {[Op.substring]: text}},
                    {authorName: {[Op.substring]: author}},
                ]
            },
            include: {
                model: Tag,
                where: {
                    // name: tag
                    name: {[Op.substring]: tag}
                },
                attributes: ['name']
            }
        });

        const recentBooks = await bss.findRecentAvail()
        // const recentBooks = await bs.findRecentlyAvailable()

        console.log(JSON.stringify(recentBooks, null, 2))

        res.status(201).json({ foundBooks , recentBooks})

    } catch (err) {
        next(err)
    }
}
