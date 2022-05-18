const express = require("express");
const app = express();
const checkin = require("./checkin.js");
const tokenchecker = require("./tokenchecker.js");
const path = require('node:path');
const flights = require("./flights.js"); //checkin.js
/**
 * configure parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * expose static resources
 */
app.use("/", express.static(process.env.FRONTEND || 'static'));
app.use('/', express.static('static')); // expose also this folder
app.use("/style",express.static("style"));

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

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
app.use("/auth_checkin",function(req,res){
    var mypath = path.join(__dirname,"../html_checkin/checkin_auth.html");
    res.sendFile(mypath);
})
app.use("/api/v1/requests",checkin);
app.use("/api/v1/flights", flights);

app.use((req, res) => {
    res.status(404);
    res.json({ error: '404: Not found' });
});

module.exports = app;