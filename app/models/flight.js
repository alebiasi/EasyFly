var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Flight', new Schema({ 
	cod: String,
    hour: String,
    company: String,
    delay: Number,
    gate: Number
}));