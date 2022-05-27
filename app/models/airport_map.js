var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Airport_map', new Schema({ 
	airport_id: String,
    url_map: String
}));