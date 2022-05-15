const express = require("express");
const app = express();
const checkin = require("./checkin.js");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/",express.static("static"));
//inserire index.html (form di login/registrazione) + ogni contenuto visibile senza login

//inserire middleware autenticazione

app.use("/api/v1/requests",checkin);

//inserire pagina not found

module.exports = app;