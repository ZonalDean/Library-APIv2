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
            description: {
                type: DataTypes.STRING(5000),
                allowNull: false,
                validate: {
                    notEmpty: false
                }
            },
            publishDate: {
                type: DataTypes.DATEONLY,
            },
            coverPhoto: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'https://res.cloudinary.com/devcloudzonal/image/upload/v1654678678/hjadgvdgdmxkxj1doir2.jpg',
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

        Book.belongsToMany(models.Tag, {through: "Book_Tag",})
    }

    return Book
}