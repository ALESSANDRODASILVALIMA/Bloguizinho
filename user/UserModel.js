const Sequelize = require('sequelize');
const con = require('../database/database');

const User = con.define('user', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }

})

//User.sync({force: true})
module.exports = User;