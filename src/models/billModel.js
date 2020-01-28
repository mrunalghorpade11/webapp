/**
 * @file billModel.js
 * @namespace model
 * @author Mrunal
 * Created Date: 01/19/2020
 * @description bill model
 */
const Sequelize = require('sequelize');
const sequelize = require("../modules/applicationPropertiesSingleton.js").sequelize;
var Bill = sequelize.define('Bill', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
    },
    owner_id: {
        allowNull: false,
        type: Sequelize.UUID,
    },
    vendor: {
        type: Sequelize.STRING
    },
    bill_date: {
        type: Sequelize.DATE
    },
    due_date: {
        type: Sequelize.DATE
    },
    amount_due: {
        type: Sequelize.DOUBLE
    },
    Categories: {
        type: Sequelize.STRING
    },
    paymentStatus: {
        type: Sequelize.ENUM('paid', 'due', 'past_due', 'no_payment_required')
    }
},
{
    updatedAt: 'updated_ts',
    createdAt: 'created_ts'   
})
sequelize.sync();
module.exports = {
    Bill
}