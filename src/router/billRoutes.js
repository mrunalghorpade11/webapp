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
const SDC = require('statsd-client'), 
sdc = new SDC({host: 'localhost', port: 8125});
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
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
    check('bill_date').exists().custom(isValidDate),
    check('due_date').exists().custom(isValidDate),
    check('amount_due').exists().isFloat({ gt: 0.00 }),
    check('categories').exists(),
    check('paymentStatus').exists().isIn(['paid', 'due', 'past_due', 'no_payment_required'])
], function (req, res) {
    sdc.increment('POST Bill');
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
        return res.send(responseObj);
    }
    if(req.body.attachment)
    delete req.body.attachment;
    billService.createBill(decodedData, req.body, function (error, result) {
        if (error) {
            res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
            res.statusMessage = "Bad Request"
            responseObj.error = error
            LOGGER.info("POST bill route complete "+FILE_NAME);
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
        return res.send(responseObj);
        
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
            for (var i in result)
                {
                    if(result[i].attachment){
                    delete result[i].attachment.dataValues.MD5hash
                    delete result[i].attachment.dataValues.size
                    }
                }
            responseObj.result = result;
            sdc.increment('GET Bill');
            LOGGER.info("get all bills route complete "+FILE_NAME)
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
        return res.send(responseObj);
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
            LOGGER.info("get bill by ID route compete "+FILE_NAME)
            res.statusCode = CONSTANTS.ERROR_CODE.SUCCESS
            res.statusMessage = "OK"
            if(result.attachment){
            delete result.attachment.dataValues.MD5hash
            delete result.attachment.dataValues.size
            }
            responseObj.result = result;
            sdc.increment('GET Bill by ID');
            res.send(responseObj);
        }
    })

})
router.delete("/bill/:id", function (req, res) {
    sdc.increment('DELETE Bill by ID');
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
        return  res.send(responseObj);
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
            LOGGER.info("Delete bill by id route complete "+FILE_NAME)
            res.statusCode = CONSTANTS.ERROR_CODE.NO_CONTENT
            res.statusMessage = "OK"
            // responseObj.result = result;
            sdc.increment('DELETE bill');
            res.send();
        }
    })

})
router.put("/bill/:id",[
    check('vendor').exists().isString(),
    check('bill_date').exists().custom(isValidDate),
    check('due_date').exists().custom(isValidDate),
    check('amount_due').exists(),
    check('categories').exists().isArray(),
    check('paymentStatus').exists().isIn(['paid', 'due', 'past_due', 'no_payment_required'])

], function (req, res) {
    const responseObj = {}
    let decodedData = {};
    sdc.increment('PUT Bill by ID');
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
        return res.send(responseObj);
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
            LOGGER.info("update route for bill complete "+FILE_NAME)
            res.statusCode = CONSTANTS.ERROR_CODE.SUCCESS
            res.statusMessage = "OK"
            responseObj.result = result;
            sdc.increment('edit-bill-by-ID');
            res.send(responseObj);
        }
    })
})

router.get("/bills/due/:days", function (req, res) {
    let decodedData = {};
    const responseObj = {}
    if(req.params.days < 0)
    {
        LOGGER.error("Invalid parameter "+FILE_NAME)
        responseObj.result = "Invalid parameter"
        return  res.send(responseObj);
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
        return  res.send(responseObj);
    }
    LOGGER.debug("param value ",req.params.days);
    billService.getBillDue(decodedData,req.params.days,function(error,result)
    {
        if(error)
        {
            res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
            res.statusMessage = "failed to get data"
            responseObj.error = error
            res.send(responseObj);
        }
        else
        {
            res.statusCode = CONSTANTS.ERROR_CODE.SUCCESS
            res.statusMessage = "OK"
            var queueParams = {
                DelaySeconds: 10,
                MessageAttributes: {
                  "QueueName": {
                    DataType: "String",
                    StringValue: "webappQueue"
                  }
                },
                MessageBody:  JSON.stringify(result),
                // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
                // MessageId: "Group1",  // Required for FIFO queues
                QueueUrl: "https://sqs.us-east-1.amazonaws.com/681276034545/webappQueue"
              };
              sqs.sendMessage(queueParams, function(err, data) {
                if (err) {
                  console.log("Error", err);
                } else {
                    LOGGER.info("message uploaded on queue" +FILE_NAME)
                  console.log("Success", data.MessageId);
                }
              });
            for (var i in result)
                {
                    if(result[i].attachment){
                    delete result[i].attachment.dataValues.MD5hash
                    delete result[i].attachment.dataValues.size
                    }
                }
            responseObj.result = result;
            LOGGER.info("get all bills due route complete "+FILE_NAME)
            res.send(responseObj);
        }
    })


})
//Date should always be YYYY-MM-DD
function isValidDate(value) {
    if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
  
    const date = new Date(value);
    if (!date.getTime()) return false;
    return date.toISOString().slice(0, 10) === value;
  }
module.exports = router;