const express = require('express');
const router = express.Router();
const BoardingCard = require('./models/boarding_card'); // get our mongoose model

/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('/', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let boardingCards = await BoardingCard.find();
    boardingCards = boardingCards.map( (boardingCard) => {
        return {
            self: '/api/v1/boarding_cards/' + boardingCard.id,
            uid: boardingCard.uid,
            name: boardingCard.name,
            surname: boardingCard.surname,
            flight_code: boardingCard.flight_code,
            date: boardingCard.date,
            time: boardingCard.time,
            seat: boardingCard.seat,
            entrance: boardingCard.entrance,
            gate_close_time: boardingCard.gate_close_time,
            landing_time: boardingCard.landing_time
        };
    });
    res.status(200).json(boardingCards);
});

router.get('/:uid', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let boardingCards = await BoardingCard.find({uid: req.params.uid});
    boardingCards = boardingCards.map( (boardingCard) => {
        return {
            self: '/api/v1/boarding_cards/' + boardingCard.id,
            uid: boardingCard.uid,
            name: boardingCard.name,
            surname: boardingCard.surname,
            flight_code: boardingCard.flight_code,
            date: boardingCard.date,
            time: boardingCard.time,
            seat: boardingCard.seat,
            entrance: boardingCard.entrance,
            gate_close_time: boardingCard.gate_close_time,
            landing_time: boardingCard.landing_time
        };
    });
    res.status(200).json(boardingCards);
});

/*
router.get('/:id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let boardingCard = await BoardingCard.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/boarding_cards/' + boardingCard.id,
        uid: boardingCard.uid,
        name: boardingCard.name,
        surname: boardingCard.surname,
        flight_code: boardingCard.flight_code,
        date: boardingCard.date,
        time: boardingCard.time,
        seat: boardingCard.seat,
        entrance: boardingCard.entrance,
        gate_close_time: boardingCard.gate_close_time,
        landing_time: boardingCard.langing_time
    });
});
*/
router.delete('/:id', async (req, res) => {
    let boardingCard = await BoardingCard.findById(req.params.id).exec();
    if (!boardingCard) {
        res.status(404).send()
        console.log('boardingCard not found')
        return;
    }
    await boardingCard.deleteOne()
    console.log('boardingCard removed')
    res.status(204).send()
});

router.post('', async (req, res) => {

	let boardingCard = new BoardingCard({
        title: req.body.title
    });
    
	boardingCard = await boardingCard.save();
    
    let boardingCardId = boardingCard.id;

    console.log('BoardingCard saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/boardingCards/" + boardingCardId).status(201).send();
});


module.exports = router;
