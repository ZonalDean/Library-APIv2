const {sequelize} = require('./models')

exports.syncSQL = async (type, target) => {

    if (!target) {
        if (type === 'force') {
            await sequelize.sync({ force: true })
        } if (type === 'alter') {
            await sequelize.sync({ alter: true })
        } else {
            await console.log(`\n'force' to force sync, 'alter' to alter sync\n`)
        }
    };
    
    if (target) {
        if (type === 'force') {
            await target.sync({ force: true })
        } if (type === 'alter') {
            await target.sync({ alter: true })
        } else {
            await console.log(`\n'force' to force sync, 'alter' to alter sync\n`)
        }
    }
    
    
    
};