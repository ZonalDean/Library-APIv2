const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define(
        'Staff', {
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
            },
            isStaff: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        }, {
            underscored: true,
            timestamps: false
        }
    );

    Staff.associate = models => {

        Staff.hasMany(models.Book, {
            foreignKey: {
                name: 'staffId',
                allowNull: false
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });

    }

    return Staff
}