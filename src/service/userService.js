/**
 * @file userService.js
 * @namespace service
 * @author Mrunal
 * Created Date: 01/19/2020
 * @description user Services
 */
const userDao = require("../Dao/userDao");
const LOGGER = require("../logger/logger");
const File_Name = 'userService.js';
const bcrypt = require('bcrypt');
/**
 *@function 
 * @name createUser
 * @description Function used for service of creating new user in DB
 * @param {Object} userData data received from request bosy
 * @param {Object} callback  
 */
function createUser(userData, callback) {
    userDao.createUsers(userData, function (error, result) {
        if (error) {
            LOGGER.error("error in create user service " + File_Name);
            return callback(error, null);
        }
        else {
            LOGGER.debug("create user service success " + File_Name);
            return callback(null, result);
        }
    })
}
/**
 *@function 
 * @name getUser
 * @description Function used to get user information from DAO
 * @param {Object} decodeObject Object received from auth token
 * @param {Object} callback  
 */
function getUser(decodeObject, callback) {
    userDao.getUser(decodeObject, function (error, result) {
        if (error) {
            LOGGER.error("Error in getUserById service", File_Name);
            return callback(error, null);
        }
        else {
            LOGGER.debug("get user service success ", File_Name)
            return callback(null, result)
        }
    })
}

/**
 *@function 
 * @name editUser
 * @description Function used to edit user information from DAO
 * @param {Object} decodeObject Object received from auth token
 * @param {Object} payload payload to edit
 * @param {Object} callback  
 */
function editUser(decodeObject, payload, callback) {
    const data = decodeObject.data
    delete payload.email_address
    delete payload.createdAt
    delete payload.updatedAt
    if (payload.password) {
        var hashedPassword = bcrypt.hashSync(payload.password, 8);
        delete payload.password;
        payload.password = hashedPassword
    }
    userDao.editUser(data, payload, function (error, result) {
        if (error) {
            LOGGER.error("Error in getUserById service", File_Name);
            return callback(error, null);
        }
        else {
            LOGGER.debug("get user service success ", File_Name)
            return callback(null, result)
        }
    })
}
module.exports = {
    createUser,
    getUser,
    editUser
}