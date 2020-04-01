/**
 * @file Server.js
 * @author Mrunal Ghorpade
 * @version 1.0
 * createdDate: 01/18/2020
 */
'use strict';
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const path = require("path");
const LOGGER = require(path.resolve(".") + "/src/logger/logger.js");
const applicationPropertiesSingleton = require(path.resolve(".") + "/src/modules/applicationPropertiesSingleton");
const appContextPath = applicationPropertiesSingleton.contextPath;
const basicrouter = require(path.resolve(".") + "/src/router/basicRoutes.js");
const billRoutes = require(path.resolve(".") + "/src/router/billRoutes.js"); 
const fileRoutes = require(path.resolve(".") + "/src/router/fileRoutes.js");
const port = 8080;
const userModel = require(path.resolve(".") + "/src/models/user").User;
const billsModel = require(path.resolve(".") + "/src/models/billModel").Bill;
const fileModel = require(path.resolve(".")+ "/src/models/fileModel").Files;
const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

require('dotenv').config();

userModel.hasMany(billsModel,{as: 'bills', foreignKey: 'owner_id'})
//fileModel.belongsTo(billsModel,{as: 'files',foreignKey:'bill_id'});
billsModel.hasOne(fileModel,{foreignKey: 'bill_id',onDelete: 'CASCADE'});

app.use(bodyParser.json());
app.use(cors());
//Routes
app.use("/v1", basicrouter);
app.use("/v1", billRoutes);
app.use("/v1",fileRoutes);

const sqsconsumer = Consumer.create({
  queueUrl: process.env.SQSurl,
  handleMessage: async (message) => {
 LOGGER.info("This is the message from SQS "+message)
 var params = {
  Message: message, /* required */
  TopicArn: process.env.TopicArn
}
var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
publishTextPromise.then(
  function(data) {
   LOGGER.info(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
    LOGGER.info("MessageID is " + data.MessageId);
  }).catch(
    function(err) {
    LOGGER.error("Error publishing to SNS"+err, err.stack);
  });
  }
});
sqsconsumer.on('error', (err) => {
  LOGGER.error("Error in sqs "+err.message);
});
sqsconsumer.on('processing_error', (err) => {
  console.error("processing error "+err.message);
});
sqsconsumer.start();
LOGGER.info("is Polling ON? "+sqsconsumer.isRunning)

app.listen(port, function () {
  LOGGER.debug("Express server listening on port %s.", port);
});
module.exports = app;

// error handler
app.use(function(err, req, res, next) {
  res.status(400);
  res.send(err);
});
