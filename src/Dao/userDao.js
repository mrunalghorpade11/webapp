/**
 * @file userDao.js
 * @namespace logger
 * @author Mrunal
 * Created Date: 01/19/2020
 * @description Dao file to access all users in the DB
 */
const userModel = require("../models/user").User;
const LOGGER = require("../logger/logger");
const File_Name = "userDao.js"
const bcrypt = require('bcrypt');
/**
 *@function 
 * @name createUser
 * @description Function used to create a new user in DB
 * @param {Object} userData user data received from the request body
 * @param {Object} callback  
 */
function createUsers(userData, callback) {
    userModel.findOrCreate({ where: { email_address: userData.email_address }, defaults: userData }).spread(function (user, created) {
        // console.log(user.get({
        //     plain: true
        // }))
        if (created) {
            LOGGER.debug("New user created in createUsers " + File_Name);
            return callback(null, user.get({ plain: true }));
        }
        else {
            LOGGER.debug("New user not created as user already exists", File_Name)
            return callback("user alread exists", null);
        }
    }).catch(function (error) {
        LOGGER.error("error in create user ", error, " ", File_Name);
        return callback(error, null);
    })

    return null
}
/**
 *@function 
 * @name getUser
 * @description Function used to get information of a user based on data received from auth token
 * @param {Object} deocdeObj Object received from auth token
 * @param {Object} callback  
 */
async function getUser(dataObj, callback) {
    LOGGER.debug("Entering getUser DAO ", File_Name);
    const dataSplit = dataObj.data.split(':')
    const userID = dataSplit[0];
    const password = dataSplit[1]
    await userModel.findOne({ where: { email_address: userID }, attributes: ['password'] }).then(
        async function (pass) {

            await bcrypt.compare(password, pass.password).then(async function (res) {
                if (res == true) {
                    let result = await userModel.findOne({ where: { email_address: userID, password: pass.password }, attributes: ['first_name', 'last_name', 'email_address','createdAt','updatedAt'] })
                    result.dataValues.account_created = result.dataValues.createdAt;
                    result.dataValues.account_updated = result.dataValues.updatedAt;
                    delete result.dataValues.createdAt;
                    delete result.dataValues.updatedAt;
                    return callback(null, result);
                }
                else {
                    LOGGER.error("password authentication failed at get user ", File_Name)
                    return callback("password authentication failed", null)
                }
            })
        }
    ).catch(function(error)
    {
        LOGGER.error("User account not found for the given GET request ",File_Name)
        return callback("user account not found",null)
    })
    return null;
}
/**
 *@function 
 * @name editUser
 * @description Function used to edit information of a user based on data received from basic auth
 * @param {Object} data Object received from auth token
 * @param {Object} payload payload from request body 
 * @param {Object} callback  
 */
async function editUser(data, payload, callback) {
    LOGGER.debug("Entering editUser DAO ", File_Name);
    const dataSplit = data.split(':')
    const userID = dataSplit[0];
    const password = dataSplit[1];
    //Find password in DB
    await userModel.findOne({ where: { email_address: userID }, attributes: ['password'] }).then(async function (pass) {
        //compare the password againt header password
        await bcrypt.compare(password, pass.password).then(function (res) {
            //if password compare success 
            if (res == true) {
                LOGGER.debug("Password match success in edit user" + File_Name);
                userModel.update(payload, { where: { email_address: userID, password: pass.password }, attributes: {exclude: ['email_address','createdAt','updatedAt']}})
                    .then(function(user){
                        userModel.findOne({ where: { email_address:userID} }).then(function (user) {
                            LOGGER.debug("user found after update: ", File_Name)
                            return callback(null, "user updated")
                        }).catch(function (error) {
                            LOGGER.error("user not found after update ", File_Name)
                            return callback(error, null);
                        })
                    }
                        
                    ).catch(function (error) {
                        LOGGER.error("Error in updating user ", File_Name)
                        return callback(error, null)
                    })
            }
            else {
                //if password compare failed
                LOGGER.error("Password does not match in edit user ", File_Name)
                return callback("password authentication failed", null);
            }
        });
    }).catch(function(error)
    {
        LOGGER.error("User account not found for the given PUT request ",File_Name)
        return callback("user account not found",null)
    })
}
module.exports = {
    createUsers: createUsers,
    getUser,
    editUser
}