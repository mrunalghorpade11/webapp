/**
 * @file billModel.js
 * @namespace model
 * @author Mrunal
 * Created Date: 01/19/2020
 * @description bill model
 */
const Sequelize = require('sequelize');
const sequelize = require("../modules/applicationPropertiesSingleton.js").sequelize;
var Bill = sequelize.define('bill', {
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
        allowNull: false,
        type: Sequelize.STRING
    },
    bill_date: {
        allowNull: false,
        type: Sequelize.DATE
    },
    due_date: {
        allowNull: false,
        type: Sequelize.DATE
    },
    amount_due: {
        allowNull: false,
        type: Sequelize.DOUBLE
    },
    categories: {
        allowNull: false,
        type: Sequelize.STRING,
        get() {
            return this.getDataValue('categories').split(',')
        },
        set(val) {
            this.setDataValue('categories', val.join(','));
        },
    },
    paymentStatus: {
        allowNull: false,
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