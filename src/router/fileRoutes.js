/**
 * @file fileRoutes.js
 * @namespace routes
 * @author Mrunal
 * Created Date: 02/08/2020
 * @description file routes
 */
const express = require("express");
var aws = require('aws-sdk')
const router = express.Router();
const CONSTANTS = require("../constants/constants");
const LOGGER = require("../logger/logger");
const base64 = require('base-64');
var multer = require('multer');
const fileService = require("../service/fileService")
const md5 = require('md5-file');
// File name to be logged
const FILE_NAME = "fileRoute.js";
var path = require('path')
var fs = require('fs');
var multerS3 = require('multer-s3')
const SDC = require('statsd-client'), 
sdc = new SDC({host: 'localhost', port: 8125});


/**
 * Endpoint to add fille to a bill
 * @memberof fillRoutes.js
 * @function /bill/:id/file
 * @param {object} req Request
 * @param {object} res Response
 * @returns {object} responseObject
 */

aws.config.update({ region:process.env.AWS_REGION});
var s3 = new aws.S3()
let startDate = new Date()
var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET,
      metadata: function (req, file, cb) {
        if (!file.mimetype.includes("jpeg") &&
        !file.mimetype.includes("jpg") &&
        !file.mimetype.includes("png") &&
        !file.mimetype.includes("application/pdf")
    ) {
        return cb({"error":"Not correct formart"}, false);
    }
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, file.originalname+Date.now());
      },
      filename: function (req, file, cb) {
        var fileName = file.originalname.split(".");
        cb(null, fileName[0] + Date.now() + "." + fileName[1]);
    }
    })
  })
  let endDate = new Date();
  var time = (endDate.getTime() - startDate.getTime())/1000;
  sdc.timing('upload-file-to-s3',time)
router.post("/bill/:id/file",upload.single('file'),function (req, res) {

        LOGGER.info("Entering add file routes " + FILE_NAME);
        const responseObj = {}
        let decodedData = {};
        if (req.file == null) {
            res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
            return res.send({"Error":"No file attached"});
        }
        const pathformd5 = req.file.location
      //  const hash = md5.sync(pathformd5);
      const hash = "abcd";
        req.file.hash = hash
     
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
        fileService.addFile(decodedData, req.params, req.file, function (error, result) {
            if (error) {
                LOGGER.error("Error in add file routes " + FILE_NAME)
                //  if(req.file)
                //         fs.unlinkSync(req.file.path)
                res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
                res.statusMessage = "Bad Request"
                responseObj.error = error
                res.send(responseObj);
            }
            else {
                res.statusCode = CONSTANTS.ERROR_CODE.CREATED
                res.statusMessage = "OK"
                delete result.MD5hash
                delete result.size
                responseObj.result = result;

                res.send(responseObj);
            }
        })
})

router.get("/bill/:bill_id/file/:file_id", function (req, res) {
    LOGGER.info("Entering get file routes " + FILE_NAME);
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
    fileService.findFile(decodedData, req.params.file_id, req.params.bill_id, function (error, result) {
        if (error) {
            res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
            res.statusMessage = "Bad Request"
            responseObj.error = error
            res.send(responseObj);
        }
        else {
            res.statusCode = CONSTANTS.ERROR_CODE.SUCCESS
            res.statusMessage = "OK"
            delete result.MD5hash
            delete result.size
            responseObj.result = result;
            res.send(responseObj);
        }
    })

})

router.delete("/bill/:bill_id/file/:file_id", function (req, res) {
    LOGGER.info("Entering get file routes " + FILE_NAME);
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
    fileService.deleteFile(decodedData, req.params.file_id, req.params.bill_id, function (error, result) {
        if (error) {
            res.statusCode = CONSTANTS.ERROR_CODE.BAD_REQUEST
            res.statusMessage = "Bad Request"
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