const express = require("express");
const app = express();
<<<<<<< HEAD
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
=======
const flights = require("./flights.js"); //checkin.js

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", express.static(process.env.FRONTEND || 'static'));
app.use('/', express.static('static')); // expose also this folder

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

app.use("/api/v1/flights", flights);

app.use((req, res) => {
    res.status(404);
    res.json({ error: '404: Not found' });
});
>>>>>>> 50f0edc2074cacb5663112f58ae5102e8b41851b

module.exports = app;