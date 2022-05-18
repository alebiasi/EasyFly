const express = require('express');
const router = express.Router();
const Document = require('./models/document'); // get our mongoose model

/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let documents = await Document.find({});
    documents = documents.map( (document) => {
        return {
            self: '/api/v1/documents/' + document.id,
            uid: document.uid,
            type: document.type,
            image_url: document.image_url
        };
    });
    res.status(200).json(documents);
});

router.get('/:uid', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let documents = await Document.find({uid: req.params.uid});
    documents = documents.map( (document) => {
        return {
            self: '/api/v1/documents/' + document.id,
            uid: document.uid,
            type: document.type,
            image_url: document.image_url
        };
    });
    res.status(200).json(documents);
});
/*
router.get('/:id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let document = await Flight.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/documents/' + document.id,
        cod: document.cod,
        hour: document.hour,
        company: document.company,
        delay: document.delay,
        gate: document.gate
    });
});
*/
router.delete('/:id', async (req, res) => {
    let document = await Flight.findById(req.params.id).exec();
    if (!document) {
        res.status(404).send()
        console.log('document not found')
        return;
    }
    await document.deleteOne()
    console.log('document removed')
    res.status(204).send()
});

router.post('', async (req, res) => {

	let document = new Flight({
        title: req.body.title
    });
    
	document = await document.save();
    
    let documentId = document.id;

    console.log('Flight saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/documents/" + documentId).status(201).send();
});


module.exports = router;
