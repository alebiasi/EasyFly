const { del } = require("express/lib/application");
var mongoose = require("mongoose");

const PSW = "123"
const DB_NAME = "easyfly"
const COLLECTION_NAME = "flights"

mongoose.connect("mongodb+srv://user:"+PSW+"@cluster0.sudvk.mongodb.net/"+DB_NAME+"?retryWrites=true&w=majority")

var Schema = mongoose.Schema;

const Flight = mongoose.model(COLLECTION_NAME, new Schema({
    cod: String,
    hour: String,
    company: String,
    delay: Number,
    gate: Number
}));

function saveFlight(_cod, _hour, _company, _delay, _gate) {
    const flight = new Flight({ 
        cod: _cod,
        hour: _hour,
        company: _company,
        delay: _delay,
        gate: _gate
    });

    flight.save()
        .then(() => {
            console.log('Saved succesfully!')
        })
        .catch((err) => {
            console.log(err);
        });
}

saveFlight("FLIGHT_123", "10:00", "Ryanair", 10, 1);
saveFlight("FLIGHT_456", "10:30", "Emirates Airlines", 0, 3);
saveFlight("FLIGHT_789", "11:00", "Alitalia", -7, 5);

