/**
 * @file basicRoutes.js
 * @namespace routes
 * @author Mrunal
 * Created Date: 01/26/2020
 * @description user routes
 */
const express = require("express");
const router = express.Router();
const CONSTANTS = require("../constants/constants");
const LOGGER = require("../logger/logger");
// File name to be logged
const FILE_NAME = "basicRoute.js";
const base64 = require('base-64');
const { check, validationResult } = require('express-validator');
const billService = require("../service/billService")
/**
 * Endpoint to send Bill info to DB
 * @memberof billRoutes.js
 * @function /bill
 * @param {object} req Request
 * @param {object} res Response
 * @returns {object} responseObject
 */
router.post("/bill", function (req, res) {
    LOGGER.info("Entering get user info routes " + FILE_NAME);
    const responseObj = {}
    let decodedData = {};
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader != undefined) {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        decodedData.data = base64.decode(bearerToken);
    }
    else {
        res.statusCode = CONSTANTS.ERROR_CODE.UNAUTHORIZED
        responseObj.result = "unauthorised token";
    }
    billService.createUserService(decodedData, req.body, function (error, result) {
        if (error) {
            res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
            res.statusMessage = "Bad Request"
            responseObj.error = error
            res.send(responseObj);
        }
        else {
            res.statusCode = CONSTANTS.ERROR_CODE.CREATED
            res.statusMessage = "OK"
            responseObj.result = result;
            res.send(responseObj);
        }
    })

})
/**
 * Endpoint to get ALL Bill from DB
 * @memberof billRoutes.js
 * @function /bill
 * @param {object} req Request
 * @param {object} res Response
 * @returns {object} responseObject
 */
router.get("/bills", function (req, res) {
    const responseObj = {}
    let decodedData = {};
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader != undefined) {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        decodedData.data = base64.decode(bearerToken);
    }
    else {
        res.statusCode = CONSTANTS.ERROR_CODE.UNAUTHORIZED
        responseObj.result = "unauthorised token";
    }

    billService.getAllBills(decodedData, function (error, result) {
        if (error) {
            res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
            res.statusMessage = "failed to get data"
            responseObj.error = error
            res.send(responseObj);
        }
        else {
            res.statusCode = CONSTANTS.ERROR_CODE.SUCCESS
            res.statusMessage = "OK"
            responseObj.result = result;
            res.send(responseObj);
        }
    })
})

router.get("/bill/:id", function (req, res) {
    const responseObj = {}
    let decodedData = {};
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader != undefined) {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        decodedData.data = base64.decode(bearerToken);
    }
    else {
        res.statusCode = CONSTANTS.ERROR_CODE.UNAUTHORIZED
        responseObj.result = "unauthorised token";
    }

    billService.getbillbyID(decodedData, req.params, function (error, result) {
        if (error) {
            res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
            res.statusMessage = "failed to get data"
            responseObj.error = error
            res.send(responseObj);
        }
        else {
            res.statusCode = CONSTANTS.ERROR_CODE.SUCCESS
            res.statusMessage = "OK"
            responseObj.result = result;
            res.send(responseObj);
        }
    })

})
router.delete("/bill/:id",function (req, res){
    const responseObj = {}
    let decodedData = {};
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader != undefined) {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        decodedData.data = base64.decode(bearerToken);
    }
    else {
        res.statusCode = CONSTANTS.ERROR_CODE.UNAUTHORIZED
        responseObj.result = "unauthorised token";
    }
    billService.deletebillbyID(decodedData, req.params, function (error, result)
    {
        if (error) {
            res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
            res.statusMessage = "failed to delete data"
            responseObj.error = error
            res.send(responseObj);
        }
        else {
            res.statusCode = CONSTANTS.ERROR_CODE.NO_CONTENT
            res.statusMessage = "OK"
           // responseObj.result = result;
            res.send();
        }
    })

})
router.put("/bill/:id", function(req,res)
{
    const responseObj = {}
    let decodedData = {};
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader != undefined) {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        decodedData.data = base64.decode(bearerToken);
    }
    else {
        res.statusCode = CONSTANTS.ERROR_CODE.UNAUTHORIZED
        responseObj.result = "unauthorised token";
    }
    billService.updatebyid(decodedData,req.params.id,req.body,function(error,result)
    {

        if (error) {
            res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
            res.statusMessage = "failed to delete data"
            responseObj.error = error
            res.send(responseObj);
        }
        else {
            res.statusCode = CONSTANTS.ERROR_CODE.SUCCESS
            res.statusMessage = "OK"
            responseObj.result = result;
            res.send(responseObj);
        }
    })
})
module.exports = router;