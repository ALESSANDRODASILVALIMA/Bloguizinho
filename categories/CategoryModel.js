const Sequelize = require('sequelize');
const con = require('../database/database');

const Category = con.define('categories', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }

})

//Category.sync({force: true})
module.exports = Category;