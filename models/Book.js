const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define(
        'Book', {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: false
                }
            },
            authorName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: false
                }
            },
            publishDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    notEmpty: false
                }
            },
            coverPhoto: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'https://res.cloudinary.com/devcloudzonal/image/upload/v1654266693/default_book_cover_2015_daqmjr.jpg',
                validate: {
                    notEmpty: false
                }
            }
        }, {
            underscored: true,
            timestamps: false
        }
    );

    Book.associate = models => {

        Book.hasMany(models.BookStock, {
            foreignKey: {
                name: 'bookId',
                allowNull: false
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });

        Book.belongsTo(models.Staff, {
            foreignKey: {
                name: 'staffId',
                allowNull: false
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });

        Book.belongsToMany(models.Tag, {
            through: "Book_Tags",
            as: "Tag",
            foreignKey: "book_id"
        })
    }

    return Book
}