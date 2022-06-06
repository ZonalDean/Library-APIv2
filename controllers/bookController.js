const bs = require('../services/bookServices')
const ts = require('../services/tagServices')
const cs = require('../config/cs')
const {Book, Tag, BookStock} = require('../models')
const createError = require("../utils/createError");
const sequelize = require('sequelize')


exports.createBook = async (req, res, next) => {
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

        for (i = 0 ; i < tagLength ; i++) {

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



        // const newTag = await Tag.create({
        //     name: tag
        // })

        // await newBook.addTag(newTag)

        const result = await Book.findOne({
            where: {
                name
            },
            include: [
                {model: Tag},
                {model: BookStock}
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