const express = require('express');
const router = express.Router();
const Flight = require('./models/flight');
const bc = require('./models/boarding_card'); 
const infoFlight = require('./models/infoFlight');


router.get('/:id', async (req, res) => {
    //verifico se trovo per un certo utente una carta d'imbarco.
    let imbarco = await bc.findOne({ uid: req.params.id}).exec();
    if(imbarco==null){
    //if(await bc.exists({ uid: req.params.id})==null){
        res.status(400).json({error: "non possiedi una carta d'imbarco per alcun volo"});
    }
    else{
        //recupero le informazioni del volo specifico
        let info1 = await Flight.findOne({ cod: imbarco.flight_code}).exec();
        if(info1==null){
            res.status(400).json({error1: "non risultatono esserci voli associati alla carta d'imbarco"});
        }
        else{
            let info2 = await infoFlight.findOne({ flight_code: imbarco.flight_code}).exec();
            if(info2==null){
                res.status(200).json({
                    error2: "non ci sono dati di aggiornamento sul volo",
                    id: req.params.id,
                    self: '/api/v1/flightInfo/',
                    cod: info1.cod,
                    hour: info1.hour,
                    company: info1.company,
                    delay: info1.delay,
                    gate: info1.gate,
                    date: imbarco.date,
                    time: imbarco.time,
                    seat: imbarco.seat,
                    entrance: imbarco.entrance,
                    gate_close_time: imbarco.gate_close_time,
                    landing_time: imbarco.landing_time,
                });
            }
            else{
                res.status(200).json({
                    id: req.params.id,
                    self: '/api/v1/flightInfo/',
                    cod: info1.cod,
                    hour: info1.hour,
                    company: info1.company,
                    delay: info1.delay,
                    gate: info1.gate,
                    date: imbarco.date,
                    time: imbarco.time,
                    seat: imbarco.seat,
                    entrance: imbarco.entrance,
                    gate_close_time: imbarco.gate_close_time,
                    landing_time: imbarco.landing_time,
                    speed: info2.speed,
                    distance: info2.distance,
                    model: info2.model,
                    estimate_arrive: info2.estimate_arrive,
                    start_location: info2.start_location,
                    arrive_location: info2.arrive_location,
                    start_long: info2.start_long,
                    start_lat: info2.start_lat,
                    arrive_long: info2.arrive_long,
                    arrive_lat: info2.arrive_lat
                });
            }
        }
        /*res.status(200).json({
            id: req.params.id
        });*/
    }
});

//per creare al volo dei dati di test
/*router.post('', async (req, res) => {
	let newUser = new infoFlight({
        flight_code: "1",
        speed: 120,
        distance: 200,
        model: "a123",
        estimate_arrive: "22:00",
        start_location: "Roma",
        arrive_location: "Trento",
        start_long: 12.4963655,
        start_lat: 41.9027835,
        arrive_long: 11.12108,
        arrive_lat: 46.06787,
    });
    newUser = await newUser.save();
    res.status(201);

});
*/

module.exports = router;