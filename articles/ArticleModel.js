const Sequelize = require('sequelize');
const con = require('../database/database');
const CategoryModel = require('../categories/CategoryModel')

Article = con.define('Articles', {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})
CategoryModel.hasMany(Article);
Article.belongsTo(CategoryModel);

//Article.sync({force: true});

module.exports = Article;
