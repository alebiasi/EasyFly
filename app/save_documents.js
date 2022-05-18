const fs = require('fs');
const express = require('express');
var mongoose = require("mongoose");
const Document = require("./models/document")
const formidable = require('formidable');
const router = express.Router();


function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 1; i < length; i++)
    text += possible. charAt(Math. floor(Math. random() * possible.length));

    return text;
}

function saveDocument(user, type_index, image_name) {

    const document = new Document({ 
        uid: user,
        type: type_index,
        image_url: image_name
    });

    document.save()
        .then(() => {
            console.log('Saved succesfully!')
        })
        .catch((err) => {
            console.log(err);
        });
}

router.post('/', async (req, res) => {
        var form = new formidable.IncomingForm();

        console.log

        form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.filepath;

        let id = makeid(16);
        let src = files.filetoupload.originalFilename;
        let newpath = './static/documents/' + id + src.substring(src.lastIndexOf('.'));
        let dbPath = './documents/' + id + src.substring(src.lastIndexOf('.'));

        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;



            saveDocument("user_123", parseInt(fields.document_type), dbPath);

            res.write("<h1>Documenti salvati con successo!</h1> \
            <a href='../../documents_page.html'>Ok</a>");
            //res.status(200).json({"path": newpath});
        });

        
    });
});


module.exports = router;