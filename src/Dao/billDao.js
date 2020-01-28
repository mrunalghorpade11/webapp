/**
 * @file billDao.js
 * @namespace logger
 * @author Mrunal
 * Created Date: 01/26/2020
 * @description Dao file to access all bills in the DB
 */
const billModel = require("../models/billModel").Bill;
const userDao = require("../Dao/userDao")
const LOGGER = require("../logger/logger");
const File_Name = "billDao.js"
/**
 *@function 
 * @name createBill
 * @description Function used to create a bill user in DB
 * @param {Object} userData user data received from the request body
 * @param {Object} callback  
 */
function createBill(billData, callback) {
    LOGGER.debug("Entering create bill " + File_Name);
    billModel.create(billData).then(function (bill) {
        LOGGER.info("new Bill created " + File_Name)
        return callback(null, bill.get({ plain: true }))
    }).catch(function (error) {
        LOGGER.error("error in create Bill " + File_Name)
        return callback("error in create bill " + error, null)
    })
}
/**
 *@function 
 * @name findAllbills
 * @description Function used to find all bills based on userID
 * @param {Object} data user data received from the request body
 * @param {Object} callback  
 */
function findAllbills(data, callback) {
    LOGGER.debug("Entering find all")
    const dataSplit = data.split(':')
    const userID = dataSplit[0];
    const password = dataSplit[1];
    userDao.getUserID(data, function (error, result) {
        if (error) {
            LOGGER.error("error in getting user ID " + File_Name)
            return callback(error, null)
        }
        else {
            billModel.findAll({where :{owner_id: result.dataValues.id }}).then(function (allBills) {
                LOGGER.info("All bills found " + File_Name)
                return callback(null, allBills)
            }).catch(function (error) {
                LOGGER.error("Error in find all " + File_Name)
                return callback("error in find all " + error, null)
            })
        }
    })
}

function getByID(data,billID,callback)
{
    LOGGER.debug("Entering find all")
    const dataSplit = data.split(':')
    const userID = dataSplit[0];
    const password = dataSplit[1];

    userDao.getUserID(data, function (error, result) {
        if(error)
        {
            LOGGER.error("error in getting user ID in getByID " + File_Name)
            return callback(error, null)
        }
        else{
            billModel.update({where:{owner_id : result.dataValues.id, id:billID}}).then(function(resultData)
            {
                LOGGER.info("get by id complete "+File_Name)
                return callback(null,resultData)
            }).catch(function (error) {
                    LOGGER.error("Error in get by ID " + File_Name)
                    return callback("error in get by id " + error, null)
                })
        }
    })

}

function deleteByID(data,billID,callback)
{
    LOGGER.debug("Entering delete by id "+File_Name)
    const dataSplit = data.split(':')
    const userID = dataSplit[0];
    const password = dataSplit[1];
    userDao.getUserID(data, function (error, result) {
        if(error)
        {
            LOGGER.error("error in getting user ID in getByID " + File_Name)
            return callback(error, null)
        }
        else{
            billModel.destroy({where:{owner_id : result.dataValues.id, id:billID}}).then(function(resultData)
            {
                LOGGER.info("get by id complete "+File_Name)
                return callback(null,resultData)
            }).catch(function (error) {
                    LOGGER.error("Error in delete by ID " + File_Name)
                    return callback("error in delte by id " + error, null)
                })
        }

    })
}

function updateByID(data,billID, payload,callback)
{
    LOGGER.debug("Entering delete by id "+File_Name)
    const dataSplit = data.split(':')
    const userID = dataSplit[0];
    const password = dataSplit[1];
    userDao.getUserID(data, function (error, result) {
        if(error)
        {
            LOGGER.error("error in getting user ID in getByID " + File_Name)
            return callback(error, null)
        }
        else{
            billModel.update(payload,{where:{owner_id : result.dataValues.id, id:billID}}).then(function(resultData)
            {
                LOGGER.info("update by id complete "+File_Name)
                return callback(null,resultData)
            }).catch(function (error) {
                    LOGGER.error("Error in update by ID " + File_Name)
                    return callback("error in update by id " + error, null)
                })
        }
    })

}
module.exports = {
    createBill,
    findAllbills,
    getByID,
    deleteByID,
    updateByID
}