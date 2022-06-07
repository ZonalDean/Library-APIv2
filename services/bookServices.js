const {Book, BookStock} = require('../models')

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

exports.findRecentlyAvailable = async () => {

    const result = await Book.findAll({
        include: {
            model: BookStock,
            order: [
                ['updateAt', 'DESC']
            ],
            attributes: []
        }
        
        
        // order: [
        //     [{model: BookStock, as:'Stock'}, 'updatedAt', 'DESC']
        //     // [Book.associations.BookStock, 'updatedAt', 'DESC']
        // ]
    });
    return result
}