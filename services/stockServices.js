const { Book, BookStock } = require('../models')

exports.findAllByStatus = async (status) => {

    const result = await BookStock.findAll({
        attributes: ["id", "status", "returnDate"],
        where: {
            status
        },
        include: {
            model: Book,
            as: 'Book',
            attributes: ["name", "authorName", "publishDate", "coverPhoto"]
        }
    });

    return result
};

exports.findById = async (id) => {

    const result = await BookStock.findOne({
        attributes: ["id", "status", "returnDate"],
        where: {
            id
        },
        include: {
            model: Book,
            as: 'Book',
            attributes: ["name", "authorName", "publishDate", "coverPhoto"]
        }
    });

    return result
}

exports.findMineByStatus = async (userId, status) => {

    const result = await BookStock.findAll({
        attributes: ["id", "status", "returnDate"],
        where: {
            userId,
            status
        },
        include: {
            model: Book,
            as: 'Book',
            attributes: ["name", "authorName", "publishDate", "coverPhoto"]
        }
    })

    return result
}