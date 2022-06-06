const {Book, Tag, BookTag} = require('../models')

exports.createTag = async (name) => {
    const result = await Tag.create({
        name
    })

    return result
};

exports.findTagByName = async (name) => {
    const result = await Tag.findOne({
        where: {
            name: name
        }
    })

    return result
};

exports.connectTag = async (book, tag) => {
    const result = await book.addTag(tag)

    return result
};