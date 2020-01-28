/**
 * @file billService.js
 * @namespace service
 * @author Mrunal
 * Created Date: 01/26/2020
 * @description bill Services
 */
const LOGGER = require("../logger/logger");
const File_Name = 'billService.js';
const userDao = require("../Dao/userDao");
const billDao = require("../Dao/billDao");
const uuidv4 = require('uuid/v4');
/**
 *@function 
 * @name createBill
 * @description Function used for service of creating new bill in DB
 * @param {Object} userData data received from request body
 * @param {Object} callback  
 */
function createUserService(decodeData, billData, callback) {

    LOGGER.debug("entering create user service " + File_Name);
    userDao.getUserID(decodeData.data, function (error, resultforID) {
        if (error) {
            LOGGER.error("Error in fetching userID " + File_Name)
            return callback(error, null);
        }
        else {
            LOGGER.info("user Id found " + File_Name)
            billData.id = uuidv4()
            billData.owner_id = resultforID.dataValues.id
            billDao.createBill(billData, function (error, result) {
                if (error) {
                    LOGGER.error("error in creating new bill " + File_Name)
                    return callback(error, null);
                }
                else {
                    LOGGER.info("create new bull success " + File_Name)
                    return callback(null, result)
                }
            })
        }
    })
}
/**
 *@function 
 * @name getAllBills
 * @description Function used for service of getting all bills for the provided user from DB
 * @param {Object} userData data received from request body
 * @param {Object} callback  
 */
function getAllBills(decodeData, callback) {
    billDao.findAllbills(decodeData.data, function (error, result) {
        if (error) {
            LOGGER.error("error in get all bills service " + File_Name)
            return callback(error, null)
        }
        else {
            LOGGER.info("get all bills service complete " + File_Name)
            return callback(null, result)
        }
    })
}
/**
*@function 
* @name getbillbyID
* @description Function used to get a perticular bill by id
* @param {Object} userData data received from request body
* @param {Object} callback  
*/
function getbillbyID(decodeData, payload, callback) {
    const id = payload.id
    billDao.getByID(decodeData.data, id, function (error, result) {
        if (error) {
            LOGGER.error("error in get bill by id " + File_Name)
            return callback(error, null)
        }
        else {
            LOGGER.info("get bill by id successfull " + File_Name)
            return callback(null, result)
        }
    })
}
/**
*@function 
* @name deletebillbyID
* @description Function used to delete a perticular bill by id
* @param {Object} decodeData data received from request body
* @param {Object} payload bill id to delete
* @param {Object} callback
*/
function deletebillbyID(decodeData, payload, callback) {
    const id = payload.id
    billDao.deleteByID(decodeData.data, id, function (error, result) {
        if (error) {
            LOGGER.error("error in delete bill by id " + File_Name)
            return callback(error, null)
        }
        else {
            LOGGER.info("delete bill by id successfull " + File_Name)
            return callback(null, result)
        }
    })
}
/**
*@function 
* @name updateBillbyid
* @description Function used to delete a perticular bill by id
* @param {Object} decodeData data received from request body
* @param {UUID} ID bill id to delete
* @param {Object} payload payload to update
* @param {Object} callback
*/
function updatebyid(decodeData, ID, payload, callback) {
    billDao.updateByID(decodeData.data, ID, payload, function (error, result) {
        if (error) {
            LOGGER.error("error in update bill by id " + File_Name)
            return callback(error, null)
        }
        else {
            LOGGER.info("update bill by id successfull " + File_Name)
            return callback(null, result)
        }
    })
}
module.exports = {
    createUserService,
    getAllBills,
    getbillbyID,
    deletebillbyID,
    updatebyid
}