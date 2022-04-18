const Sequelize = require('Sequelize');
const con = new Sequelize("blog", "postgres", "12345",{
    host: 'localhost',
    dialect: 'postgres',
    //timezone: '-03:00' usa para configura hora de acordo com a região
})

module.exports = con;