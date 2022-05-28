const express = require('express');
const router = express.Router();
const Flight = require('./models/flight');
const bc = require('./models/boarding_card'); 
const infoFlight = require('./models/infoFlight');


router.get('/:id', async (req, res) => {
    //verifico se trovo per un certo utente una carta d'imbarco.
    let imbarco = await bc.find({ uid: req.params.id});
    if(!imbarco){
        res.status(400).json({error: "non possiedi una carta d'imbarco per alcun volo"});
    }
    else{
        //recupero le informazioni del volo specifico
        let info1 = await Flight.find({ cod: imbarco.flight_code});
        let info2 = await infoFlight.find({ flight_code: imbarco.flight_code});
        res.status(200).json({
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
            type: info2.type,
            estimate_arrive: info2.estimate_arrive,
            start_location: info2.start_location,
            arrive_location: info2.arrive_location
        });
    }
});

module.exports = router;