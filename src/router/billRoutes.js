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
router.post("/bill", [
    check('vendor').exists().isString(),
    check('bill_date').exists().isString(),
    check('due_date').exists().isString(),
    check('amount_due').exists().isNumeric(),
    check('categories').exists(),
    check('paymentStatus').exists().isIn(['paid', 'due', 'past_due', 'no_payment_required'])
], function (req, res) {
    LOGGER.info("Entering get user info routes " + FILE_NAME);
    const responseObj = {}
    let decodedData = {};
    if(req.body.id || req.body.created_ts || req.body.updated_ts || req.body.owner_id)
    {
        return res.status(400).json("Do No add write only values")
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader != "undefined") {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        decodedData.data = base64.decode(bearerToken);
    }
    else {
        res.statusCode = CONSTANTS.ERROR_CODE.UNAUTHORIZED
        responseObj.result = "unauthorised token";
    }
    billService.createBill(decodedData, req.body, function (error, result) {
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
    if (typeof bearerHeader != "undefined") {
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
    if (typeof bearerHeader != "undefined") {
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
            if (error == "user unauthorized to access this data") {
                res.statusCode = CONSTANTS.ERROR_CODE.UNAUTHORIZED
                res.statusMessage = "Unauthorised"
                responseObj.error = error
                res.send(responseObj);
            }
            else if (error == "data not found") {
                res.statusCode = CONSTANTS.ERROR_CODE.NOT_FOUND
                res.statusMessage = "NOT FOUND"
                responseObj.error = error
                res.send(responseObj);
            }
            else {
                res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
                res.statusMessage = "BAD REQUEST"
                responseObj.error = error
                res.send(responseObj);
            }
        }
        else {
            res.statusCode = CONSTANTS.ERROR_CODE.SUCCESS
            res.statusMessage = "OK"
            responseObj.result = result;
            res.send(responseObj);
        }
    })

})
router.delete("/bill/:id", function (req, res) {
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
    billService.deletebillbyID(decodedData, req.params, function (error, result) {
        if (error) {
            if (error == "user unauthorized to access this data") {
                res.statusCode = CONSTANTS.ERROR_CODE.UNAUTHORIZED
                res.statusMessage = "Unauthorised"
                responseObj.error = error
                res.send(responseObj);
            }
            else if (error == "data not found") {
                res.statusCode = CONSTANTS.ERROR_CODE.NOT_FOUND
                res.statusMessage = "NOT FOUND"
                responseObj.error = error
                res.send(responseObj);
            }
            else {
                res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
                res.statusMessage = "BAD REQUEST"
                responseObj.error = error
                res.send(responseObj);
            }
        }
        else {
            res.statusCode = CONSTANTS.ERROR_CODE.NO_CONTENT
            res.statusMessage = "OK"
            // responseObj.result = result;
            res.send();
        }
    })

})
router.put("/bill/:id",[
    check('vendor').exists().isString(),
    check('bill_date').exists(),
    check('due_date').exists(),
    check('amount_due').exists(),
    check('categories').exists().isArray(),
    check('paymentStatus').exists().isIn(['paid', 'due', 'past_due', 'no_payment_required'])

], function (req, res) {
    const responseObj = {}
    let decodedData = {};
    if(req.body.id || req.body.created_ts || req.body.updated_ts || req.body.owner_id)
    {
        return res.status(400).json("Do No add write only values")
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
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
    billService.updatebyid(decodedData, req.params.id, req.body, function (error, result) {
        if (error) {
            if (error == "user unauthorized to access this data") {
                res.statusCode = CONSTANTS.ERROR_CODE.UNAUTHORIZED
                res.statusMessage = "Unauthorised"
                responseObj.error = error
                res.send(responseObj);
            }
            else if (error == "data not found") {
                res.statusCode = CONSTANTS.ERROR_CODE.NOT_FOUND
                res.statusMessage = "NOT FOUND"
                responseObj.error = error
                res.send(responseObj);
            }
            else {
                res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
                res.statusMessage = "BAD REQUEST"
                responseObj.error = error
                res.send(responseObj);
            }
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