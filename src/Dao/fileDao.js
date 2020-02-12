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

function addFile(fileData, callback) {
    LOGGER.debug("Entering add file DAO " + File_Name);
    fileModel.create(fileData).then(function (file) {
        LOGGER.info("new file attached " + File_Name)
        return callback(null, file.get({ plain: true }))
    }).catch(function (error) {
        fs.unlinkSync(fileData.url);
        return callback("Error in adding file ", null);
        // fs.unlink(fileData.url,function(error)
        // {
        //     if(error)
        //     {
        //         LOGGER.error("error in deleting duplicate file from disk "+error+File_Name)
        //         return callback("Error in deleting duplicate file");
        //     }
        //     LOGGER.debug("duplicate file deleted from disk "+error+File_Name)
        //     return callback("error in adding a file ", null)
            
        // })
        // LOGGER.error("Duplicate file " + File_Name)
        
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
            fs.unlink(result.url, function (err) {
                if (err) {
                    LOGGER.error("Could not delete file " + File_Name);
                    return callback("could not delete file ", null)
                }
                else {
                    LOGGER.debug("File deleted from server ",File_Name);
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