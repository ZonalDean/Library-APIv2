const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: false
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: false
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: false
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: false
            }
        }
    }, {
        underscored: true
    }
    );

    User.associate = models => {

        User.hasMany(models.BookStock, {
            foreignKey: {
                name: 'userId'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        })

    }

    return User
}