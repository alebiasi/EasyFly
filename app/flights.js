const express = require('express');
const router = express.Router();
const Flight = require('./models/flight'); // get our mongoose model

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
        self: '/api/v1/flights/' + flight.id,
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


module.exports = router;
