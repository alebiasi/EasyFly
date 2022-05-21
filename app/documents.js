const express = require('express');
const router = express.Router();
const Document = require('./models/document');

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

module.exports = router;
