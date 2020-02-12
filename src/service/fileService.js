/**
 * @file fileService.js
 * @namespace Service
 * @author Mrunal
 * Created Date: 02/09/2020
 * @description file service
 */
const LOGGER = require("../logger/logger");
const File_Name = 'fileService.js';
const CONSTANTS = require('../constants/constants');
const fileDao = require('../Dao/fileDao');
const billService = require('../service/billService');
const uuidv4 = require('uuid/v4');

function addFile(decodeData, payload, fileData, callback) {
    LOGGER.debug("entering add file service " + File_Name);
    billService.getbillbyID(decodeData, payload, function (error, result) {
        if (error) {
            LOGGER.error("Error in add file, bill service " + File_Name);
            return callback(error, null)
        }
        else {
            if (result) {
                filePayload = {
                    id: uuidv4(),
                    bill_id: result.dataValues.id,
                    file_name: fileData.originalname,
                    url: fileData.path,
                    MD5hash: fileData.hash,
                    size : fileData.size
                }
                fileDao.addFile(filePayload, function (error, result) {
                    if (error) {
                        LOGGER.error("Error in add file service " + File_Name)
                        return callback(error, null);
                    }
                    else {
                        LOGGER.debug("add file service complete " + File_Name)
                        return callback(null, result)
                    }
                })
            }
            else {
                return callback("bill not found ", null);
            }
        }
    })
}

function findFile(decodeData, file_id, bill_id, callback) {
    LOGGER.debug("entering find file service " + File_Name);
    const bill_id_payload = {
        id: bill_id
    }
    billService.getbillbyID(decodeData, bill_id_payload, function (error, result) {
        if (error) {
            LOGGER.error("error in find file " + File_Name)
            return callback(error, null);
        }
        else {
            if (result) {
                fileDao.findOne(file_id, bill_id, function (error, result) {
                    if (error) {
                        LOGGER.error("error in find one " + File_Name);
                        return callback(error, null);
                    }
                    else {
                        LOGGER.debug("bill found " + File_Name)
                        return callback(null, result);
                    }
                })
            }
            else {
                return callback("Bill Not found ", null);
            }

        }
    })
}

function deleteFile(decodeData, file_id, bill_id, callback) {
    LOGGER.debug("entering delete file service " + File_Name);
    const bill_id_payload = {
        id: bill_id
    }
    billService.getbillbyID(decodeData, bill_id_payload, function (error, result) {
        if (error) {
            LOGGER.error("error in find file " + File_Name)
            return callback(error, null);
        }
        else {
            if (result) {
                fileDao.destroy(file_id, bill_id, function (error, result) {
                    if (error) {
                        LOGGER.error("Error in delete file " + File_Name)
                        return callback(error, null);
                    }
                    else {
                        LOGGER.debug("delete file completed " + File_Name)
                        return callback(null, result);
                    }
                })
            }
            else {
                return callback("Bill Not found ", null);
            }

        }
    })

}
module.exports = {
    addFile,
    findFile,
    deleteFile
}