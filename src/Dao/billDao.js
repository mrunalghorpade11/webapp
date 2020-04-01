/**
 * @file billDao.js
 * @namespace logger
 * @author Mrunal
 * Created Date: 01/26/2020
 * @description Dao file to access all bills in the DB
 */
const billModel = require("../models/billModel").Bill;
const fileModel = require("../models/fileModel").Files;
const userDao = require("../Dao/userDao")
const LOGGER = require("../logger/logger");
const File_Name = "billDao.js"
const CONSTANTS = require("../constants/constants")
var aws = require('aws-sdk')
const moment = require('moment')
var fs = require('fs');
const { Op } = require("sequelize");
var s3 = new aws.S3()
const SDC = require('statsd-client'),
    sdc = new SDC({ host: 'localhost', port: 8125 });
/**
 *@function 
 * @name createBill
 * @description Function used to create a bill user in DB
 * @param {Object} userData user data received from the request body
 * @param {Object} callback  
 */
function create(billData, callback) {
    LOGGER.debug("Entering create bill " + File_Name);
    let billStartTime = new Date();
    billModel.create(billData).then(function (bill) {
        LOGGER.info("new Bill created " + File_Name)
        billModel.findOne({ where: { id: bill.dataValues.id }, include: fileModel }).then(function (result) {
            LOGGER.debug("Find one after result complete " + File_Name)
            let billEndTime = new Date();
            let billAIPtime = billEndTime.getMilliseconds() - billStartTime.getMilliseconds();
            LOGGER.info('time need for create bill DAO ', billAIPtime);
            sdc.timing('Create-bill-DAO-time', billAIPtime)
            return callback(null, result);
        }).catch(function (error) {
            LOGGER.error("Error in find one after create")
            return callback("Error in findone after create ", null);
        })
        // return callback(null, bill.get({ plain: true }))
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
    userDao.getUserID(data, function (error, result) {
        if (error) {
            LOGGER.error("error in getting user ID " + File_Name)
            return callback(error, null)
        }
        else {
            billModel.findAll({ where: { owner_id: result.dataValues.id }, include: fileModel }).then(function (allBills) {
                LOGGER.info("All bills found " + File_Name)
                if (allBills == null) {
                    return callback(null, CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND)
                }
                return callback(null, allBills)
            }).catch(function (error) {
                LOGGER.error("Error in find all " + File_Name)
                return callback("error in find all " + error, null)
            })
        }
    })
}
function findOne(billID, callback) {
    billModel.findOne({
        where: { id: billID }, include: fileModel //include: fileModel
    }).then(function (resultOfbillID) {
        LOGGER.debug("bill ID found " + File_Name)
        return callback(null, resultOfbillID)
    }).catch(function (error) {
        LOGGER.error("Error in finding Bill ID " + File_Name)
        return callback(error, null)
    });

}

function destroy(billID, callback) {
    billModel.findOne({
        where: { id: billID }, include: fileModel
    }).then(function (resultOfbillID) {
        // console.log("resultofbillID ",resultOfbillID)
        LOGGER.debug("bill ID found " + File_Name)
        if (resultOfbillID.dataValues.attachment != null) {
            let params = {
                Bucket: process.env.S3_BUCKET,
                Key: resultOfbillID.dataValues.attachment.key
            };
            s3.deleteObject(params, function (err, data) {
                if (err)
                    return callback(err, null);
                else {
                    // console.log("data, aftr deleting from s3 ",data);
                    LOGGER.trace("File deleted from S3 " + File_Name);
                    billModel.destroy({ where: { id: billID } }).then(function (resultFromDestroy) {
                        LOGGER.debug("Bill deleted by detroy function " + File_Name)
                        return callback(null, resultFromDestroy);
                    }).catch(function (error) {
                        LOGGER.error("error in deleting bill");
                        return callback(error, null);
                    })

                }
            })
        }
        else {
            billModel.destroy({ where: { id: billID } }).then(function (resultFromDestroy) {
                LOGGER.debug("Bill deleted by detroy function " + File_Name)
                return callback(null, resultFromDestroy);
            }).catch(function (error) {
                LOGGER.error("error in deleting bill");
                return callback(error, null);
            })
        }



        // return callback(null, resultOfbillID)
    }).catch(function (error) {
        LOGGER.error("Error in finding Bill ID " + File_Name)
        return callback(error, null)
    });
}
function update(billID, payload, callback) {
    billModel.update(payload, { where: { id: billID } }).then(function (result) {
        LOGGER.debug("Bill updated successfully " + File_Name)
        findOne(billID, function (error, result) {
            if (error) {
                LOGGER.error("bill not found " + File_Name)
                return callback(error, null)
            }
            else {
                LOGGER.debug("Returning responce " + File_Name)
                return callback(null, result)
            }
        })
    }).catch(function (error) {
        LOGGER.error("Error in update " + File_Name)
        return callback(error, null);
    })
}
/**
 *@function 
 * @name due
 * @description Function used to find all bills that are due within a given date
 * @param {integer} param Number of day from with due bills are required
 * @param {Object} callback  
 */
function due(data,param, callback) {
    let toDate
    const fromDate = new Date()
    let ran_date = moment(fromDate, "DD.MM.YYYY");
    if(param == 0){
        toDate = fromDate;
    }else{
         toDate = ran_date.add(param,'days');
    }
    
   
    userDao.getUserID(data, function (error, result) {
        if (error) {
            LOGGER.error("error in getting user ID " + File_Name)
            return callback(error, null)
        }
        else {
            billModel.findAll({
                where: {
                    due_date: {
                        [Op.between]: [fromDate, toDate]
                    }
                }, include: fileModel
            }).then(function (bills) {
                LOGGER.debug("due bills found " + File_Name)
                if (bills == null) {
                    return callback(null, "no due bills")
                }
                return callback(null, bills)
            }).catch(function (error) {
                LOGGER.error("Error in find all due bills " + File_Name)
                return callback("error in find all due bills " + error, null)
            })
        }
    })
}
module.exports = {
    create,
    findAllbills,
    findOne,
    destroy,
    update,
    due
}