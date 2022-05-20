var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("Request", new Schema({
    user_id: String,
    document_id: String,
    booking_code: String,
    n_cases: Number,
    request_time: Date,
    status: Number
}));