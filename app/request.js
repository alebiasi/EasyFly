var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.export = mongoose.model("Request", new Schema({
    person: String,
    document_id: String,
    booking_code: String,
    n_cases: Number,
    request_time: Date,
    status: Number
}));