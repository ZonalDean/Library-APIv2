const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define(
        'Tag', {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: false
                }
            },
        }, {
            underscored: true,
            timestamps: false
        }
    );

    Tag.associate = models => {

        Tag.belongsToMany(models.Book, {
            through: "Book_Tag",
            as: "Book",
            foreignKey: "tag_id"
        })
    }

    return Tag
}