/**
 * @file fileDao.js
 * @namespace logger
 * @author Mrunal
 * Created Date: 02/09/2020
 * @description DAO for file data
 */
const fileModel = require("../models/fileModel").Files
const LOGGER = require("../logger/logger");
const File_Name = "fileDao.js"
const CONSTANTS = require("../constants/constants")
var fs = require('fs');
var aws = require('aws-sdk')
var s3 = new aws.S3()
const SDC = require('statsd-client'),
sdc = new SDC({ host: 'localhost', port: 8125 });
function addFile(fileData, callback) {
    let startDate = new Date();
    LOGGER.debug("Entering add file DAO " + File_Name);
    fileModel.create(fileData).then(function (file) {
        LOGGER.info("new file attached " + File_Name)
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        sdc.timing('DAO-operation-to-create-file', seconds);
        return callback(null, file.get({ plain: true }))
    }).catch(function (error) {
        let params = {
            Bucket: process.env.S3_BUCKET,
            Key: fileData.key
        };
        s3.deleteObject(params, function (err, data) {
            if (err)
                return callback("Error in deleting from S3", null);
            else
                return callback("Error in adding file ", null);
        })

    })
}

function findOne(file_id, bill_id1, callback) {
    LOGGER.debug("Entering findOne " + File_Name);
    fileModel.findOne({ where: { id: file_id, bill_id: bill_id1 } }).then(function (file) {
        LOGGER.debug("file found " + File_Name)
        if (file) {
            LOGGER.debug("File found in find one " + File_Name);
            return callback(null, file.get({ plain: true }))
        }
        else return callback(CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND, null);

    }).catch(function (error) {
        LOGGER.error("Error in find one " + File_Name)
        return callback(error, null);
    })
}

function destroy(file_id, bill_id1, callback) {
    LOGGER.debug("Entering destroy " + File_Name);
    findOne(file_id, bill_id1, function (error, result) {
        if (result) {
          //  console.log("result ",result);
            let params = {
                Bucket: process.env.S3_BUCKET,
                Key: result.key
            };
            s3.deleteObject(params, function (err, data) {
                if (err)
                    return callback(err, null);
                else
                    {
                        fileModel.destroy({ where: { id: file_id, bill_id: bill_id1 } }).then(function (deleted) {
                            if (deleted >= 1) {
                                LOGGER.debug("File deleted " + File_Name)
                                return callback(null, "File Deleted successfully")
                            }
                            else {
                                LOGGER.error("NO data to delete " + File_Name)
                                return callback(CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND, null);
                            }
                        }).catch(function (error) {
                            LOGGER.error("error in destroy " + File_Name)
                            return callback(error, null);
                        }) 
                    }
            })
        }
        else {
            LOGGER.error("File not found for deletion " + File_Name);
            return callback("File not found for deletion ", null);
        }
    })

}
module.exports = {
    addFile,
    findOne,
    destroy
}