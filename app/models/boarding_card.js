var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Boarding_card', new Schema({ 
    uid: String,
	name: String,
    surname: String,
    flight_code: String,
    date: String,
    time: String,
    seat: String,
    entrance: String,
    gate_close_time: String,
    landing_time: String
}));