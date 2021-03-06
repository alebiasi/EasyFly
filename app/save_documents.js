const fs = require('fs');
const express = require('express');
var mongoose = require("mongoose");
const Document = require("./models/document")
const formidable = require('formidable');
const router = express.Router();
const nodemailer = require("nodemailer");
var mv = require('mv');

function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 1; i < length; i++)
    text += possible. charAt(Math. floor(Math. random() * possible.length));

    return text;
}

function SaveDocument(user, type_index, image_name) {

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

function ChangeUrl(user_id, document_type, newUrl) {
    Document.replaceOne(
        { uid: user_id, type: document_type },
        { uid: user_id, type: document_type, image_url: newUrl },
        function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Document updated!");
            }
        });
}

function UpdateDocument(user_id, document_type, newUrl) {
    Document.findOne({uid: user_id, type: document_type},
         function (err, docs) {
        // docs is an array of partially-`init`d documents
        // defaults are still applied and will be "populated"
            
            if(docs != null) {

                let string = docs.image_url;

                let name = (string.substring(string.lastIndexOf('\\')));
                let completeOldPath = "./static/" + name;

                fs.unlink(completeOldPath, function (err, docs) {
                    if (err) throw err;
    
                    console.log("Old images deleted!");
                });

                ChangeUrl(user_id, document_type, newUrl);
            } else {
                SaveDocument(user_id, document_type, newUrl);
            }

        });

}

router.post('/', async (req, res) => {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if(fields.document_type==2){    //if document_type == 2 it means that i am inserting the boarding card, so i can notify the user that the check-in procedure went well with a mail
            var myhtml="";
            if(fields.request_status==1){
                myhtml= "<p>Il team di EasyFly ?? lieto di informarla che la sua richiesta di check-in online ?? andata a buon fine ed ?? stata accettata.</p><p>Le auguriamo una buona giornata ed un buon volo</p><p>Il team di EasyFly</p>";
            }else{
                myhtml= "<p>Il team di EasyFly ?? dispiaciuto di informarla che la sua richiesta di check-in online non ?? andata a buon fine.</p><p>Le auguriamo una buona giornata.</p><p>Il team di EasyFly</p>";
            }
            var transporter = nodemailer.createTransport({  //create transporter to send email to users
                service: 'gmail',
                auth: {
                    user: 'easyfly.ids2@gmail.com',
                    pass: process.env.EMAIL_PASS
                }
            });
            var mailOptions = { //create email
                from: 'easyfly.ids2@gmail.com',
                to: fields.email, 
                subject: 'Esito richiesta check-in online',
                html: myhtml
            };
            transporter.sendMail(mailOptions, function(error, info){    //send email
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        if(fields.document_type!=2 || fields.request_status==1){
            var oldpath = files.filetoupload.filepath
            let id = makeid(16);
            let src = files.filetoupload.originalFilename;
            let newpath = './static/documents/' + id + src.substring(src.lastIndexOf('.'));
            let dbPath = './documents/' + id + src.substring(src.lastIndexOf('.'));

            /*
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;

                UpdateDocument(fields.uid, parseInt(fields.document_type), dbPath);

                res.status(200).write("<html><head><link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../../style.css\"></head> \
                <body> <div class=\"flightsContainer\"><h1>Documenti salvati con successo!</h1> \
                <a href='../../main_page'>Ok</a></body></a></html>");
            });
            */

            mv(oldpath, newpath, function(err) {
                if (err) throw err;

                UpdateDocument(fields.uid, parseInt(fields.document_type), dbPath);

                res.status(200).write("<html><head><link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"../../style.css\"></head> \
                <body> <div class=\"flightsContainer\"><h1>Documenti salvati con successo!</h1> \
                <a href='../../main_page'>Ok</a></body></a></html>");
            });

        }
    });
});


module.exports = router;