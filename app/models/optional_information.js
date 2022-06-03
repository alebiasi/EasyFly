var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('OptInformation', new Schema({ 
	uid: String,
    pathology: {
        type: String,
        default: "",
        require: false
    },
    allergies: {
        type: String,
        default: "",
        require: false
    },
    covid_vaccines: {
        type: Number,
        default: 0,
        require: false
    },
    more_info: {
        type: String,
        default: "",
        require: false
    }
}));