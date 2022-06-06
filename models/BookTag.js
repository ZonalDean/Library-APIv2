const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const BookTag = sequelize.define(
        'Book_Tag', {
            underscored: true,
            timestamps: false
        }
    );

    return BookTag
}