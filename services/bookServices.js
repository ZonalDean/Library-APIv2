const {Book, BookStock, Tag} = require('../models')

exports.findBookById = async (id) => {
    const result = await Book.findOne({
        where: {
            id
        },
        include: [
            {model: Tag},
            {model: BookStock}
        ] 
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

