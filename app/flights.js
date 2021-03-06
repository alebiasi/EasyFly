const express = require('express');
const router = express.Router();
const Flight = require('./models/flight'); // get our mongoose model
const Requests = require("./models/request");
const User = require("./models/user");
var nodemailer = require('nodemailer');
const mongoose = require("mongoose");
/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let flights = await Flight.find({});
    flights = flights.map( (flight) => {
        return {
            self: '/api/v1/flights/' + flight.id,
            cod: flight.cod,
            hour: flight.hour,
            company: flight.company,
            delay: flight.delay,
            gate: flight.gate
        };
    });
    res.status(200).json(flights);
});

router.get('/:id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let flight = await Flight.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/flights/' + flight._id,
        cod: flight.cod,
        hour: flight.hour,
        company: flight.company,
        delay: flight.delay,
        gate: flight.gate
    });
});

/**
 * search by flight code instead of id
 */
router.get("/flight_code/:code", async (req,res)=>{
    let flight = await Flight.find({cod:req.params.code});
    console.log(flight);
    res.status(200).json({
        self: '/api/v1/flights/' + flight._id,
        cod: flight.cod,
        hour: flight.hour,
        company: flight.company,
        delay: flight.delay,
        gate: flight.gate
    });
});

router.delete('/:id', async (req, res) => {
    let flight = await Flight.findById(req.params.id).exec();
    if (!flight) {
        res.status(404).send()
        console.log('flight not found')
        return;
    }
    await flight.deleteOne()
    console.log('flight removed')
    res.status(204).send()
});

router.post('', async (req, res) => {

	let flight = new Flight({
        title: req.body.title
    });
    
	flight = await flight.save();
    
    let flightId = flight.id;

    console.log('Flight saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/flights/" + flightId).status(201).send();
});

/**
 * Update the delay of a specific flight and send email notification to all users of that flight
 */
router.put("/:code",async function(req,res){
    var code = req.params.code; //flight code
    console.log(code);
    try{
        var delay=req.body.delay; //delay minutes
        var request = await Flight.updateOne({"cod":code},{$set:{"delay":delay}}); //update entry
        if(request.acknowledged==false){    //verify if there is an error when updating and entry
            console.log("Error");
            res.status(404).send("Error"); 
        }else{
            var transporter = nodemailer.createTransport({  //create transporter to send email to users
                service: 'gmail',
                auth: {
                    user: 'easyfly.ids2@gmail.com',
                    pass: process.env.EMAIL_PASS
                }
            });
            var htmltext="";
            if(delay>0) //create message to send
                htmltext="<div><p>Gentile Utente,<br/>il team di EasyFly ?? dispiaciuto di informarla che il volo per cui ha effettuato il check-in ?? in ritardo di "+delay+" minuti.<br/>Ci scusiamo per l'inconveniente e le auguriamo una buona giornata.<br/>Il team di EasyFly</div>"
            else
                htmltext="<div><p>Gentile Utente,<br/>il team di EasyFly ?? dispiaciuto di informarla che il volo per cui ha effettuato il check-in ?? stato cancellato.<br/>Ci scusiamo per l'inconveniente e le auguriamo una buona giornata.<br/>Il team di EasyFly</div>"
            var emails="";

            var requests = await Requests.find({"booking_code":code});  //get all check-in requests with a specific code
            if(requests.acknowledged==false){   
                console.log("Error");
                res.status(404).send("Error"); 
            }else{
                for(var i=0; i<requests.length;i=i+1){
                    var user_id= requests[i].user_id; 
                    var mongoid = new mongoose.mongo.ObjectId(user_id);    //get id from req
                    var user= await User.findById(mongoid); //find user from id
                    var email = user.email; //get user email
                    emails+=email+", ";

                }
            }
            console.log("Sending mail to: ",emails);
            var mailOptions = { //create email
                                from: 'easyfly.ids2@gmail.com',
                                to: emails, //send email to notify that the flight is on late / deleted
                                subject: 'Sembra che ci siano problemi con il tuo volo',
                                html: htmltext
                            };
            if(emails!=""){    //send mail if there is at least 1 passenger
                transporter.sendMail(mailOptions, function(error, info){    //send email
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }

            res.status(200).send("Success");    
        }
    }catch(error){
        res.status(404).send("Error flight code "+code+" not found");
    }
});

module.exports = router;
