const fs = require('fs');
const express = require('express');
var mongoose = require("mongoose");
const Document = require("./models/document")
const router = express.Router();

router.post('', async function(req, res) {
    try {
        var del_doc = await Document.deleteOne({uid: req.body.uid, type: parseInt(req.body.document_type)});
        if(del_doc.acknowledged==false){    //return message
            //res.status(404).send("Error while deleting image");
            return res.status(404).redirect('back');
        }else{
            //res.status(200).send("Delete success");
            return res.status(200).redirect('back');
        }
    }
    catch (error) {
        // res.status(404).send("Error:"+ error +" not found");
        return res.status(404).redirect('back');
    }
    return res.status(200).redirect('back');
});

module.exports = router;