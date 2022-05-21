const express = require("express");
const app = express();

const boarding_cards = require("./boarding_cards.js");
const documents = require("./documents.js");
const save_documents = require("./save_documents.js");
const checkin = require("./checkin.js");
const tokenchecker = require("./tokenchecker.js");
const path = require('node:path');
const flights = require("./flights.js");
const auth = require("./authentication.js");
var util = require("util");
const disconnect = require('./disconnect.js');
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
app.use("/script",express.static("script"));

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    //console.log(util.inspect(req.body,{showHidden: false, depth: null}))
    next()
})

/**
 * authentication middleware
 */
app.use('/api/v1/authentication',auth);
app.use("/api/v1/requests",tokenchecker);
app.use("/checkin",tokenchecker);

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
});

app.use("/error",function(req,res){
    var mypath = path.join(__dirname,"../static/error_page.html");
    res.sendFile(mypath);
});

app.use("/login",function(req,res){
    var mypath = path.join(__dirname,"../static/login.html");
    res.sendFile(mypath);
});

app.use("/register",function(req,res){
    var mypath = path.join(__dirname,"../static/register.html");
    res.sendFile(mypath);
});

app.use("/api/v1/requests",checkin);
app.use("/api/v1/flights", flights);
app.use("/api/v1/boarding_cards", boarding_cards);
app.use("/api/v1/documents", documents);
app.use("/api/v1/save_documents", save_documents);
app.use("/api/v1/disconnect", disconnect);

app.use((req, res) => {
    res.status(404);
    res.json({ error: '404: Not found' });
});

module.exports = app;