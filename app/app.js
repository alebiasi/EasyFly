const express = require("express");
const app = express();
const checkin = require("./checkin.js");
const tokenchecker = require("./tokenchecker.js");
const path = require('node:path');
/**
 * configure parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * expose static resources
 */
app.use("/",express.static("static"));
app.use("/style",express.static("style"));

/**
 * authentication middleware
 */
//add authentication.js here
//app.use("/api/v1/requests",tokenchecker);

/**
 * routing
 */
app.use("/main_page",function(req,res){
    var mypath = path.join(__dirname,"../static/main_page.html");
    res.sendFile(mypath);
});
app.use("/checkin",function(req,res){
    var mypath = path.join(__dirname,"../html_checkin/checkin.html");
    res.sendFile(mypath);
});
app.use("/accept_page",function(req,res){
    var mypath = path.join(__dirname,"../html_checkin/accept_page.html");
    res.sendFile(mypath);
});
app.use("/api/v1/requests",checkin);

//insert page not found

module.exports = app;