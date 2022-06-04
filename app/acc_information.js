const fs = require('fs');
const express = require('express');
var mongoose = require("mongoose");
const OptInformation = require("./models/optional_information")
const router = express.Router();

async function saveData(user_uid, user_pathology, user_allergies, user_vaccine, user_more_info) {
    let result_operation;
    const optInformation = new OptInformation({
        uid: user_uid,
        pathology: user_pathology,
        allergies: user_allergies,
        covid_vaccine: user_vaccine,
        more_info: user_more_info
    });

    await optInformation.save()
    .then( () => result_operation = 200 )
    .catch( err => {
        console.log(err);
        result_operation = 400;
    });
    return result_operation;
}

async function updateData(user_uid, user_pathology, user_allergies, user_vaccine, user_more_info) {
    let result_operation;
    await OptInformation.updateOne(
        {uid: user_uid},
        {uid: user_uid, pathology: user_pathology, allergies: user_allergies, covid_vaccines: user_vaccine, more_info: user_more_info},
        function(err, docs) {
            if(err) {
                result_operation = 400;
                console.log(err);
            }
            else result_operation = 200;
        }
    )
    return result_operation;
}

async function saveOrUpdate(user_uid, user_pathology, user_allergies, user_vaccine, user_more_info) {
    await OptInformation.findOne({uid: user_uid}, function(err, docs) {
        if(err) console.log(err);

        if(docs != null) {
            return updateData(user_uid, user_pathology, user_allergies, user_vaccine, user_more_info);
        }
        else {
            return saveData(user_uid, user_pathology, user_allergies, user_vaccine, user_more_info)
        }
    });
}

router.post('/', async function(req, res) {
    // get all value of form
    const uid = req.body.uid;
    const pathology = req.body.pathology; // checkbox return an array but we store it in one string
    const pathology_concat = pathology != undefined ? pathology.filter(Boolean).join(';'): "";
    const allergies = req.body.allergies;
    const vaccine = req.body.vaccine;
    const more_info = req.body.moreInfo;

    const result_operation = await saveOrUpdate(uid, pathology_concat, allergies, vaccine, more_info);

    return res.status(result_operation).redirect('back');
});

// get informaion from db
router.get('/:uid', async (req, res) => {
    let result_operation = 200;
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let optInformation = await OptInformation.find({uid: req.params.uid}, function(err, doc) {
        if(err) {
            result_operation = 400;
            console.log(err);
        }
    });
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
    return res.status(result_operation).json(optInformation);
});

module.exports = router;