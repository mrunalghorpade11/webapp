/**
 * @file user.js
 * @namespace model
 * @author Mrunal
 * Created Date: 01/19/2020
 * @description file model
 */
const Sequelize = require('sequelize');
const sequelize = require("../modules/applicationPropertiesSingleton.js").sequelize;
var Files = sequelize.define('attachments', {
    id: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
    },
    bill_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true
    },
    file_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
  MD5hash: {
    type: Sequelize.STRING,
    allowNull:false
    }
},
    {
        timestamps: true,
        updatedAt: false,
        createdAt: 'upload_date'
    });
sequelize.sync();
module.exports = {
    Files
}