var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Document', new Schema({ 
	uid: String,
    type: Number,
    image_url: String
}));