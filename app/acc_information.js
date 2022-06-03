const fs = require('fs');
const express = require('express');
var mongoose = require("mongoose");
const OptInformation = require("./models/optional_information")
const router = express.Router();

function saveData(user_uid, user_pathology, user_allergies, user_vaccine, user_more_info) {
    const optInformation = new OptInformation({
        uid: user_uid,
        pathology: user_pathology,
        allergies: user_allergies,
        covid_vaccine: user_vaccine,
        more_info: user_more_info
    });

    optInformation.save()
    .then( () => console.log('Saved succesfully') )
    .catch( err => console.log(err) );
}

function updateData(user_uid, user_pathology, user_allergies, user_vaccine, user_more_info) {
    OptInformation.replaceOne(
        {uid: user_uid},
        {uid: user_uid, pathology: user_pathology, allergies: user_allergies, covid_vaccine: user_vaccine, more_info: user_more_info},
        function(err, docs) {
            if(err) console.log(err);
            else console.log('Optional information updated');
        }
    )
}

function saveOrUpdate(user_uid, user_pathology, user_allergies, user_vaccine, user_more_info) {
    OptInformation.findOne({uid: user_uid}, function(err, docs) {
        if(err) console.log(err);

        if(docs != null) {
            updateData(user_uid, user_pathology, user_allergies, user_vaccine, user_more_info);
        }
        else {
            saveData(user_uid, user_pathology, user_allergies, user_vaccine, user_more_info)
        }
    });
}

router.post('/', async function(req, res) {
    // get all value of form
    const uid = req.body.uid;
    console.log(uid);
    const pathology = req.body.pathology; // checkbox return an array but we store it in one string
    const pathology_concat = pathology != undefined ? pathology.filter(Boolean).join(';'): "";
    const allergies = req.body.allergies;
    const vaccine = req.body.vaccine;
    const more_info = req.body.moreInfo;

    saveOrUpdate(uid, pathology_concat, allergies, vaccine, more_info);

    res.redirect('back');
});

// get informaion from db
router.get('/:uid', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let optInformation = await OptInformation.find({uid: req.params.uid});
    optInformation = optInformation.map( (optInformation) => {
        return {
            self: '/api/v1/acc_information/' + optInformation.id,
            uid: optInformation.uid,
            pathology: optInformation.pathology,
            allergies: optInformation.allergies,
            covid_vaccine: optInformation.covid_vaccines,
            more_info: optInformation.more_info
        };
    });
    res.status(200).json(optInformation);
});

module.exports = router;