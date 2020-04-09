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
const fs = require('fs');
const path = process.env.Home_dir
const rdsCa = fs.readFileSync(path+'rds-ca-2019-root.pem');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DBNAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mariadb',
        ssl: {
            rejectUnauthorized: true,
            ca: [rdsCa]
        }
    }
);
module.exports = {
    port,
    contextPath,
    sequelize : sequelize
}