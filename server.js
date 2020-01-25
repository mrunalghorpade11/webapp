/**
 * @file Server.js
 * @author Mrunal Ghorpade
 * @version 1.0
 * createdDate: 01/18/2020
 */
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const path = require("path");
const LOGGER = require(path.resolve(".") + "/src/logger/logger.js");
const applicationPropertiesSingleton = require(path.resolve(".") + "/src/modules/applicationPropertiesSingleton");
const appContextPath = applicationPropertiesSingleton.contextPath;
const basicrouter = require(path.resolve(".") + "/src/router/basicRoutes.js");
const port = 8080;
const database = require(path.resolve(".") + "/src/models/user");
app.use(bodyParser.json());
app.use(cors());
//Routes
app.use("/v1", basicrouter);

var server = app.listen(port, function () {
  LOGGER.debug("Express server listening on port %s.", port);
});
module.exports = app;
