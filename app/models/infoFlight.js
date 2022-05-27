var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('infoFlight', new Schema({ 
    flight_code: String,
    speed: Number,
    distance: Number,
    model: String,
    type: String,
    estimate_arrive: Date,
    start_location: String,
    arrive_location: String
}));