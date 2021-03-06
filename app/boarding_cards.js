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

/**
 * add a new boarding_card to db
 */
 router.post("",async function(req,res){
    let boarding_card = new BoardingCard({
        uid:req.body.uid,
        name:req.body.name,
        surname:req.body.surname,
        flight_code:req.body.flight_code,
        time:req.body.time
    });
    await boarding_card.save();
    res.status(201);
});
module.exports = router;
