const {Book} = require('../models')

exports.findBookById = async (id) => {
    const result = await Book.findOne({
        where: {
            id
        }
    })

    return result
};

exports.findBookByName = async (name) => {
    const result =  await Book.findOne({
        where: {
            name
        }
    })

    return result
};

