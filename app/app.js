const express = require("express");
const app = express();
const flights = require("./flights.js");
const boarding_cards = require("./boarding_cards.js");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", express.static(process.env.FRONTEND || 'static'));
app.use('/', express.static('static')); // expose also this folder

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

app.use("/api/v1/flights", flights);
app.use("/api/v1/boarding_cards", boarding_cards);

app.use((req, res) => {
    res.status(404);
    res.json({ error: '404: Not found' });
});

module.exports = app;