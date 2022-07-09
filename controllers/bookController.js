const bs = require('../services/bookServices')
const bss = require('../services/stockServices')
const ts = require('../services/tagServices')
const sc = require('../sc')
const cs = require('../config/cs')
const { Book, Tag, BookStock } = require('../models')
const createError = require("../utils/createError");
const { sequelize, Op } = require('sequelize')
const fs = require('fs')
const cloudinary = require('../utils/cloudinary')
// Staff
exports.staffCreateBook = async (req, res, next) => {
    try {
        const { name, authorName, description } = req.body;

        // #1 input validation        
        if (!name) {
            createError('name required', 400)
        } if (!authorName) {
            createError('author first name required', 400)
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


        let coverPhoto

        if (req.file) {
            const result = await cloudinary.upload(req.file.path);
            coverPhoto = result.secure_url;
        }

        const newBook = await Book.create({
            name: name,
            authorName,
            // publishDate,
            staffId: req.user.id,
            coverPhoto,
            description
        });

        // (tags)

        // const tagArr = tags.split('%')

        //     (tagArr)
        // // ORGINAL VERSION
        // const tagLength = tagArr.length
        // // // For loop creating and adding tags
        // for (i = 0; i < tagLength; i++) {

        //     const tagCurrent = tagArr.pop()
        //         (tagCurrent)

        //     const isTagDupe = await Tag.findOne({
        //         where: {
        //             name: tagCurrent
        //         }
        //     });

        //     if (isTagDupe) {
        //         await newBook.addTag(isTagDupe)
        //     }

        //     if (!isTagDupe) {
        //         const newTag = await Tag.create({
        //             name: tagCurrent
        //         });
        //         await newBook.addTag(newTag)
        //     }

        // };

        // For loop creating IndivdualBooks based on number
        // for (let i = 0; i < number; i++) {
        //     await BookStock.create({
        //         bookId: newBook.id,
        //         status: cs.AVAILABLE
        //     })
        // };

        // const result = await Book.findOne({
        //     where: {
        //         name
        //     }
        // })

        res.status(201).json({ message: 'books created', newBook })
    } catch (err) {
        next(err)
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
    }
}

exports.staffUpdateBook = async (req, res, next) => {
    try {

        const id = req.params.id

        const { name, authorName, publishDate, description } = req.body

        // Remove all tags first

        // const currentTags = await Tag.findAll({
        //     where: {
        //         '$Books.id$': id
        //     },
        //     include: {
        //         model: Book,
        //         as: 'Books'
        //     }
        // })
        // const removeTagFromBook = await bs.findBookById(id);
        // await removeTagFromBook.removeTag(currentTags)
        // .then
        const bookToUpdate = await bs.findBookById(id);

        if (name) {
            bookToUpdate.name = name
        }

        if (authorName) {
            bookToUpdate.authorName = authorName
        }

        if (publishDate) {
            bookToUpdate.publishDate = publishDate
        }
        if (description) {
            bookToUpdate.description = description
        }
        
        // if (tags) {

        //     // bookToUpdate.removeTags()

        //     const tagArr = tags.split('%')

        //     // (tagArr)
        //     // ORGINAL VERSION
        //     const tagLength = tagArr.length

        //     // // For loop creating and adding tags
        //     for (i = 0; i < tagLength; i++) {

        //         const tagCurrent = tagArr.pop()
        //             (tagCurrent)

        //         // book

        //         const isTagDupe = await Tag.findOne({
        //             where: {
        //                 name: tagCurrent
        //             }
        //         });

        //         if (isTagDupe) {
        //             await bookToUpdate.addTag(isTagDupe)
        //         }

        //         if (!isTagDupe) {
        //             const newTag = await Tag.create({
        //                 name: tagCurrent
        //             });
        //             await bookToUpdate.addTag(newTag)
        //         }

        //     }
        // }



        if (req.file) {
            const splited = bookToUpdate.coverPhoto.split('/');
            const publicId = splited[splited.length - 1].split('.')[0];
            await cloudinary.destroy(publicId);
            const result = await cloudinary.upload(req.file.path);
            bookToUpdate.coverPhoto = result.secure_url;
        }

        await bookToUpdate.save()

        // (JSON.stringify(bookToUpdate, null, 2))

        const updatedBook = await bs.findBookById(id)

        res.status(201).json({ message: 'book updated', updatedBook })

    } catch (err) {
        next(err)
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
    }
}

exports.staffDeleteBookAndStock = async (req, res, next) => {
    try {

        const id = req.params.id

        const bookToDelete = await bs.findBookById(id)

        const stocksToDelete = await BookStock.findAll({
            where: {
                bookId: id
            }
        })

        const splited = bookToDelete.coverPhoto.split('/');
        const publicId = splited[splited.length - 1].split('.')[0];
        await cloudinary.destroy(publicId);

        bookToDelete.destroy();
        // stocksToDelete.destroy();

        res.status(201).json({ message: 'resource deleted' })
    } catch (err) {
        next(err)
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
    }
}

exports.staffSearch = async (req, res, next) => {
    try {

        let search = req.params.search
        let tag = req.params.tag

        if (!search) {
            search = ''
        } if (!tag) {
            tag = ''
        } if (search === 'undefined') {
            search = ''
        } if (tag === 'all') {
            tag = ''
        }

        const foundBooks = await Book.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.substring]: search } },
                    { authorName: { [Op.substring]: search } },
                    { description: { [Op.substring]: search } },
                ]
            },
            include: {
                model: Tag,
                as: "Tags",
                where: {
                    name: { [Op.substring]: tag }
                },
                attributes: ['name'],
                separate: true
            },
            include: {
                model: BookStock,
                as: "BookStocks"
            }
        });

        res.status(201).json({ foundBooks })

    } catch (err) {
        next(err)
    }
}

// Tag
exports.staffDeleteBookTag = async (req, res, next) => {
    try {

        const tagId = req.params.tagid
        const bookId = req.params.bookid

        const foundBook = await bs.findBookById(bookId)
        const foundTag = await Tag.findOne({
            where: { id: tagId }
        })

        await foundBook.removeTag(foundTag)

        const updatedTags = await Tag.findAll({
            include: {
                model: Book,
                where: {
                    id: bookId
                }
            }
        })

        res.status(201).json({ updatedTags })
    } catch (err) {
        next(err)
    }
}

exports.staffAddTag = async (req, res, next) => {
    try {

        const bookId = req.params.bookid
        const tagname = req.params.tagname

        const isTagDupe = await Tag.findOne({
            where: {
                name: tagname
            }
        });

        const bookToUpdate = await Book.findOne({
            where: {
                id: bookId
            }
        })

        if (isTagDupe) {
            await bookToUpdate.addTag(isTagDupe)
        }

        if (!isTagDupe) {
            const newTag = await Tag.create({
                name: tagname
            });
            await bookToUpdate.addTag(newTag)
        }

        const updatedTags = await Tag.findAll({
            include: {
                model: Book,
                where: {
                    id: bookId
                }
            }
        })

        res.status(201).json({ updatedTags })

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
            },
            include: [
                {
                    model: BookStock,
                    as: 'BookStocks',
                    attributes: ["status", "id"],

                },
                {
                    model: Tag,
                    as: 'Tags',
                }
            ]
        });

        if (!book) {
            createError('Book with this ID does not exist', 400)
        }

        res.status(201).json({ book })
    } catch (err) {
        next(err)
    }

}

exports.findBooksByTag = async (req, res, next) => {
    try {
        const tag = req.params.tag

        const foundBooks = await Book.findAll({
            limit: 7,
            include: [
                {
                    model: Tag,
                    as: 'Tags',
                    where: { name: tag }
                },
                {
                    model: BookStock,
                    as: 'BookStocks',
                    where: { status: cs.AVAILABLE },
                    separate: true,
                }
            ]
        })

        // res.status(201).json({ foundTag})
        res.status(201).json({ foundBooks })
    } catch (err) {
        next(err)
    }


}

exports.searchBook = async (req, res, next) => {
    try {

        let search = req.params.search
        let tag = req.params.tag

        if (!search) {
            search = ''
        } if (!tag) {
            tag = ''
        } if (search === 'undefined') {
            search = ''
        } if (tag === 'all') {
            tag = ''
        }

        const searchFilter = await Book.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.substring]: search } },
                    { authorName: { [Op.substring]: search } },
                    { description: { [Op.substring]: search } },
                ]
            },
            include: {
                model: BookStock,
                as: "BookStocks",
                where: {
                    status: cs.AVAILABLE
                },
                separate: true
            }
        });

        // const tagFilter = await Book.findAll({
        //     include: {
        //         model: Tag,
        //         as: "Tags",
        //         where: {
        //             name: tag
        //         }
        //     }
        // });

        const result = { ...searchFilter }

        // const recentBooks = await bss.findRecentAvail()
        // const recentBooks = await bs.findRecentlyAvailable()

        // (JSON.stringify(searchFilter, null, 2))
        // console.log(searchFilter)
        res.status(201).json({ result })

    } catch (err) {
        next(err)
    }
}

exports.getDisplayWithTags = async (req, res, next) => {
    try {

        const { tag } = req.params.tag

        const foundBooks = await Book.findAll({
            limit: 7,
            include: [
                {
                    model: Tag,
                    as: 'Tags',
                    where: { name: tag }
                },
                {
                    model: BookStock,
                    as: 'BookStocks',
                    where: { status: cs.AVAILABLE },
                    separate: true,
                }
            ]
        })

        res.status(201).json({ foundBooks })

    } catch (err) {
        next(err)
    }
}

exports.getAllTags = async (req, res, next) => {
    try {

        const foundTags = await Tag.findAll()

        res.status(201).json({ foundTags })

    } catch (err) {
        next(err)
    }
}

exports.getBookTagsAndStock = async (req, res, next) => {
    try {

        const id = req.params.id

        // console.log(bookId)

        const foundBook = await Book.findOne({
            where: { id },
            include: [
                {
                    model: BookStock,
                    as: "BookStocks"
                },
                {
                    model: Tag,
                    as: "Tags"
                }
            ]
        })

        res.status(201).json({ foundBook })
    } catch (err) {
        next(err)
    }

}

exports.getBookData = async (req, res, next) => {
    try {

        const id = req.params.id

        const book = await Book.findOne({
            where: id,
            include: [
                {
                    model: Tag,
                    as: "Tags",
                },
                {
                    model: BookStock,
                    as: "Bookstocks"
                }
            ]
        })

        res.status(201).json({ foundBook })

    } catch (err) {
        next(err)
    }
}