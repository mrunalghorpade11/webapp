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
const CONSTANTS = require('../constants/constants')
/**
 *@function 
 * @name createBill
 * @description Function used for service of creating new bill in DB
 * @param {Object} userData data received from request body
 * @param {Object} callback  
 */
function createBill(decodeData, billData, callback) {

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
            billDao.create(billData, function (error, result) {
                if (error) {
                    LOGGER.error("error in creating new bill " + File_Name)
                    return callback(error, null);
                }
                else {
                    LOGGER.info("create new bill success " + File_Name)
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
    billDao.findOne(id, function (error, resultFromBills) {
        if (error) {
            LOGGER.error("Error in finding ID " + File_Name)
            return callback(error, null);
        }
        else {
            LOGGER.debug("Entering getBillById " + File_Name)
            if (resultFromBills) {
                userDao.getUserID(decodeData.data, function (error, resultOFUserId) {
                    if (error) {
                        LOGGER.error("Error in finding user ID " + File_Name)
                        return callback(error, null)
                    }

                    if (resultFromBills.owner_id == resultOFUserId.dataValues.id) {
                        return callback(null, resultFromBills)
                    }
                    else {
                        return callback(CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED, null)
                    }
                })
            }
            else {
                LOGGER.error("Bill Id not found " + File_Name);
                return callback(CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND, null)
            }
        }
    })

    // billDao.getByID(decodeData.data, id, function (error, result) {
    //     if (error) {
    //         LOGGER.error("error in get bill by id " + File_Name)
    //         return callback(error, null)
    //     }
    //     else {
    //         LOGGER.info("get bill by id successfull " + File_Name)
    //         return callback(null, result)
    //     }
    // })
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
    billDao.findOne(id, function (error, resultFromBills) {
        if (error) {
            LOGGER.error("Error in finding bill ID " + File_Name)
            return callback(error, null);
        }
        else {
            if (resultFromBills) {
                LOGGER.debug("Entering delete bill by id " + File_Name)
                userDao.getUserID(decodeData.data, function (error, resultOFUserId) {
                    if (error) {
                        LOGGER.error("Error in fiding userID " + File_Name)
                        return callback(error, null)
                    }
                    else {
                        if (resultFromBills.owner_id == resultOFUserId.dataValues.id) {
                            billDao.destroy(id, function (error, result) {
                                if (error) {
                                    LOGGER.error("Error in destroy service " + File_Name)
                                    return callback(error, null)
                                }
                                else {
                                    LOGGER.debug("Destroy complete " + File_Name)
                                    return callback(null, CONSTANTS.ERROR_DESCRIPTION.SUCCESS)
                                }
                            })
                        }
                        else {
                            LOGGER.error("user not authorised to delete this bill " + File_Name)
                            return callback(CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED, null)
                        }
                    }
                })
            }
            else {
                LOGGER.debug("bill not found " + File_Name)
                return callback(CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND, null)
            }

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
    billDao.findOne(ID, function (error, resultFromBills) {
        if (error) {
            LOGGER.error("Error in updating service " + File_Name)
            return callback(error, null)
        }
        else {
            if (resultFromBills) {
                LOGGER.debug("Entering update by id service " + File_Name)
                userDao.getUserID(decodeData.data, function (error, resultOFUserId) {
                    if (error) {
                        LOGGER.error("Error in finding the user " + File_Name)
                        return callback(error, null)
                    }
                    else {
                        if (resultFromBills.owner_id == resultOFUserId.dataValues.id) {
                            billDao.update(ID, payload, function (error, result) {
                                if (error) {
                                    LOGGER.error("error in update service " + File_Name)
                                    return callback(error, null)
                                }
                                else {
                                    LOGGER.debug("Update service compter " + File_Name)
                                    return callback(null, result)
                                }
                            })
                        }
                        else {
                            LOGGER.error("User not authorised to update this bill " + File_Name)
                            return callback(CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED, null)
                        }
                    }
                })
            }
            else {
                LOGGER.error("No bill found " + File_Name)
                return callback(CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND, null)
            }


        }
    })
}
/**
*@function 
* @name getBillDue
* @description Function used get bills due by a date
* @param {Object} decodeData data received from request body
* @param {Integer} param number of days to retrive
* @param {Object} callback
*/
function getBillDue(decodeData, param, callback) {
    LOGGER.debug("in due bill service "+File_Name);
    billDao.due(decodeData.data, param, function (error, result) {
        if (error) {
            LOGGER.error("error in get all bills due service " + File_Name)
            return callback(error, null)
        }
        else {
            LOGGER.info("get all bills due service complete " + File_Name)
            return callback(null, result)
        }
    })
}
module.exports = {
    createBill,
    getAllBills,
    getbillbyID,
    deletebillbyID,
    updatebyid,
    getBillDue
}