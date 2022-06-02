var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('infoFlight', new Schema({ 
    flight_code: String,
    speed: Number,
    distance: Number,
    model: String,
    estimate_arrive: String,
    start_location: String,
    arrive_location: String,
    start_long: Number,
    start_lat: Number,
    arrive_long: Number,
    arrive_lat: Number,
}));