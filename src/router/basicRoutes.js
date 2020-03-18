/**
 * @file basicRoutes.js
 * @namespace routes
 * @author Mrunal
 * Created Date: 01/19/2020
 * @description user routes
 */
const express = require("express");
const router = express.Router();
const CONSTANTS = require("../constants/constants");
const LOGGER = require("../logger/logger");
// File name to be logged
const FILE_NAME = "basicRoute.js";
const userService = require("../service/userService");
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const { check, validationResult } = require('express-validator');
const uuidv4 = require('uuid/v4');
var passwordValidator = require('password-validator');
const SDC = require('statsd-client'), 
sdc = new SDC({host: 'localhost', port: 8125});
/**
 * Endpoint to send user info to DB
 * @memberof basicnRoute.js
 * @function /info
 * @param {object} req Request
 * @param {object} res Response
 * @returns {object} responseObject
 */
router.post("/user", [
  check('first_name').isString().exists(),
  check('email_address').exists().isEmail(),
  check('last_name').exists().isString(),
  check('password').exists()
], async function (req, res) {
  LOGGER.info("Entering Get user Route" + FILE_NAME);
  let responseObj = {};
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  var schema = new passwordValidator();
  schema.is().min(8).has().uppercase().has().lowercase().has().digits() 
  if(!schema.validate(req.body.password))
  {
    return res.status(400).json("password must be 8 character, one lowercase letter, one uppercase letter, on digit")
  }
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const userData = {
    id: uuidv4(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email_address: req.body.email_address,
    password: hashedPassword
  }
  userService.createUser(userData, function (error, result) {
    if (error) {
      LOGGER.error("Error in getUserby ID route " + FILE_NAME);
      res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST;
      responseObj.result = error
      res.send(responseObj);
    }
    else {
      LOGGER.info("create success " + FILE_NAME);
      res.statusCode = CONSTANTS.ERROR_CODE.CREATED;
      res.statusMessage = "User Created"
      delete result.password;
      responseObj.result = result;
      sdc.increment('POST user');
      res.send(responseObj);
    }
  })
});
/**
 * Endpoint to fetch user info from DB
 * @memberof basicnRoute.js
 * @function /info
 * @param {object} req Request
 * @param {object} res Response
 * @returns {object} responseObject
 */
router.get("/user/self", function (req, res) {
  sdc.increment('GET User');
  LOGGER.info("Entering get user info routes " + FILE_NAME);
  //create responce object
  const responseObj = {}
  let decodedData = {};
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader != "undefined") {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    decodedData.data = base64.decode(bearerToken);
  }
  else {
    res.statusCode = CONSTANTS.ERROR_CODE.UNAUTHORIZED
    responseObj.result = "unauthorised token";
    res.send(responseObj);
  }
  userService.getUser(decodedData, function (error, result) {
    if (error) {
      res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
      res.statusMessage = "failed to get data"
      responseObj.error = error
      res.send(responseObj);
    }
    else {
      LOGGER.info("GET user complete" + FILE_NAME)
      res.statusCode = CONSTANTS.ERROR_CODE.SUCCESS
      res.statusMessage = "OK"
      responseObj.result = result;
      res.send(responseObj);
    }
  })

})
/**
 * Endpoint to edit user info from DB
 * @memberof basicnRoute.js
 * @function /info
 * @param {object} req Request
 * @param {object} res Response
 * @returns {object} responseObject
 */
router.put("/user/self", function (req, res) {
  sdc.increment('PUT User');
  LOGGER.info("Entering PUT user info routes " + FILE_NAME);
  let responseObj = {}
  let decodedData = {};
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader != "undefined") {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    decodedData.data = base64.decode(bearerToken);
  }
  else {
    res.statusCode = CONSTANTS.ERROR_CODE.UNAUTHORIZED
    responseObj.result = "unauthorised token";
    res.send(responseObj);
  }
  function checkPayload(req)
  {
    if(!req.body.first_name || !req.body.last_name || !req.body.password || !req.body.email_address)
    {
    res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
    return res.status(400).json('Incomplete payload')
  }
  }
  checkPayload(req);
  /**
   *@function 
   * @name editUser
   * @description Function used to send edit information to userService
   * @param {Object} decodeObject Object received from auth token
   * @param {Object} req.body request payload 
   * @param {Object} callback  
   */
  userService.editUser(decodedData, req.body, function (error, result) {
    if (error) {
      LOGGER.error("Error in edit user route ", FILE_NAME)
      res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
      res.statusMessage = "BAD REQUEST"
      responseObj.error = error
      res.send(responseObj);
    }
    else {
      LOGGER.info("Update user route complete ", FILE_NAME)
      res.statusCode = CONSTANTS.ERROR_CODE.NO_CONTENT
      res.statusMessage = "OK"
      delete result.password;
      responseObj.result = result;
      res.send(responseObj);
    }
  })

})
module.exports = router;