const express = require('express');
const router = express.Router();
const Airport_map = require('./models/airport_map'); // get our mongoose model

/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let airport_maps = await Airport_map.find({});
    airport_maps = airport_maps.map( (airport_map) => {
        return {
            self: '/api/v1/airport_maps/' + airport_map.id,
            airport_id: airport_map.airport_id,
            url_map: airport_map.url_map
        };
    });
    res.status(200).json(airport_maps);
});

router.get('/:airport_id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findOne
    let airport_maps = await Airport_map.findOne({airport_id: req.params.airport_id},
        function (err, docs) {

            if (docs != null)
                return {
                    self: '/api/v1/airport_maps/' + docs.id,
                    airport_id: docs.airport_id,
                    url_map: docs.airport_map
                }
        });

    res.status(200).json(airport_maps);
});


module.exports = router;
