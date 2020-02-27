/**
 * @file applicationPropertiesSingleton.js
 * @namespace modules
 * @author Mrunal
 * Created Date: 01/19/2020
 * @description Application Properties
 */
const port = {
    port:8080
}
const contextPath = {
    contextPath: "/assignment"
}
var Sequelize = require('sequelize');
var sequelize = new Sequelize('CSYE6225',process.env.DB_USERNAME,process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mariadb'
    }

);
module.exports = {
    port,
    contextPath,
    sequelize : sequelize
}