const express = require("express");
const app = express();
const checkin = require("./checkin.js");
const tokenchecker = require("./tokenchecker.js");
const accept_page = require("./accept_page.js");

/**
 * configure parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * expose static resources
 */
app.use("/",express.static("static"));

/**
 * authentication middleware
 */
//add authentication.js here
//app.use("/api/v1/requests",tokenchecker);

/**
 * routing
 */
//app.use("/accept",accept_page);
app.use("/api/v1/requests",checkin);

//insert page not found

module.exports = app;