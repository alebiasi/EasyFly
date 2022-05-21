const { del } = require("express/lib/application");
var mongoose = require("mongoose");

const PSW = "123"
const DB_NAME = "easyfly"
const COLLECTION_NAME = "documents"

mongoose.connect("mongodb+srv://user:"+PSW+"@cluster0.sudvk.mongodb.net/"+DB_NAME+"?retryWrites=true&w=majority")

var Schema = mongoose.Schema;

const Document = mongoose.model(COLLECTION_NAME, new Schema({
    uid: String,
    url: String

}));

function saveDocument(user, image_name) {
    const flight = new Document({ 
        uid: user,
        url: "../documents/" + image_name 
    });

    flight.save()
        .then(() => {
            console.log('Saved succesfully!')
        })
        .catch((err) => {
            console.log(err);
        });
}

//saveDocument("01234", "img1.jpg");
//saveDocument("0456", "img3.jpg");
//saveDocument("0789", "img4.jpg");


function getDocuments() {
    let mimage;

    Document.find({uid: "01234"}, function(err, obj) {   
        mimage = (obj[0].url)
        console.log(obj + "\n\n")  // undefined                   
    })

    return mimage;
}

//getDocuments();
/*
saveFlight("FLIGHT_123", "10:00", "Ryanair", 10, 1);
saveFlight("FLIGHT_456", "10:30", "Emirates Airlines", 0, 3);
saveFlight("FLIGHT_789", "11:00", "Alitalia", -7, 5);
*/
