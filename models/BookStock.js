const sequelize = require('sequelize');
const cs = require('../config/cs')


module.exports = (sequelize, DataTypes) => {
    const BookStock = sequelize.define(
        'BookStock', {
        status: {
            type: DataTypes.ENUM(`${cs.AVAILABLE}`, `${cs.RESERVED}`, `${cs.READY}`, `${cs.OUT}`),
            allowNull: false,
            defaultValue: (`${cs.AVAILABLE}`)
        },
        returnDate: {
            type: DataTypes.DATE
        }
    }, {
        underscored: true,
    }
    );

    BookStock.associate = models => {

        BookStock.belongsTo(models.Book, {
            foreignKey: {
                name: 'bookId',
                allowNull: false
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
        
        BookStock.belongsTo(models.User, {
            foreignKey: {
                name: 'userId'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });


    }

    return BookStock
}