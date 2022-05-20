const express = require("express");
const Request = require("./models/request");
const util = require("util");
const router = express.Router();
const mongoose = require("mongoose");
const path = require('node:path');

router.use(express.json());
router.use(express.urlencoded());

/**
 * add a request to db
 */
router.post("",async function(req,res){ 
    var datetime = new Date();  //get current date
    let request = new Request({ //create new request object based on data from the user
        user_id:req.body.user_id,   //user_id:req.loggedUser.id,
        document_id:req.body.document_id,
        booking_code:req.body.booking_code,
        n_cases:req.body.n_cases,
        request_time:datetime,
        status:0
    })

    await request.save();   //save the new request
    res.redirect("/accept_page");
});

/**
 * get all requests
 */
router.get("",async function(req,res){
    var risposta='{"requests":[';
    var requests = await Request.find();    //get all requests from db
    requests.forEach(element => {   //create json object
        risposta+='{"_id":"'+element._id+'","user_id":"'+element.user_id+'","document_id":"'+element.document_id+'","booking_code":"'+element.booking_code+'","n_cases":"'+element.n_cases+'","request_time":"'+element.request_time+'","status":"'+element.status+'"},';
    });
    risposta+='{}]}';   
    rispostajson=JSON.parse(risposta);  //parse json object
    res.status(200).json(rispostajson); //send object
});

router.get("/pending",async function(req,res){
    var risposta='{"requests":[';
    var requests = await Request.find({"status":0});    //get all requests from db
    requests.forEach(element => {   //create json object
        risposta+='{"_id":"'+element._id+'","user_id":"'+element.user_id+'","document_id":"'+element.document_id+'","booking_code":"'+element.booking_code+'","n_cases":"'+element.n_cases+'","request_time":"'+element.request_time+'","status":"'+element.status+'"},';
    });
    risposta+='{}]}';   
    rispostajson=JSON.parse(risposta);  //parse json object
    res.status(200).json(rispostajson); //send object
});
/**
 * get a specific request
 */
router.get("/:id",async function(req,res){
    var id = req.params.id;
    try{    //if the given id is not on the correct format mongoose throws an error
        var mongoid = new mongoose.mongo.ObjectId(id);    //get id from req
        var request= await Request.findById(mongoid); //find request on db   
        if(request==null){    //if the request does not exists, send error 404 
            res.status(404).send("Error id "+id+" not found");
        }else{//else send the json back
            res.status(200).json(request);
        }
    }catch(error){
        res.status(404).send("Error id "+id+" not found");
    }
});

router.post("/:id",function(req,res){
    res.status(504).send("Method not allowed");
});

/**
 * update a specific request
 */
router.put("/:id",async function(req,res){
    var id = req.params.id;
    try{
        var mongoid = new mongoose.mongo.ObjectId(id);    //get id from req
        var status=req.body.status; //get status from body
        var request = await Request.updateOne({"_id":mongoid},{$set:{"status":status}}); //update entry
        if(request.acknowledged==false){    //return message
            res.status(404).send("Error");  //TODO verify correct status code
        }else{
            res.status(200).send("Modification success");
        }
    }catch(error){
        res.status(404).send("Error id "+id+" not found");
    }
    

});

/**
 * delete a specific request
 */
router.delete("/:id",async function(req,res){   
    var id=req.params.id;
    try{
        var mongoid = new mongoose.mongo.ObjectId(id);    //get id from req
        var request = await Request.deleteOne({"_id":mongoid});  //delete entry
        if(request.acknowledged==false){    //return message
            res.status(404).send("Error while deleting an entry");
        }else{
            res.status(200).send("Delete success");
        }
    }catch(error){
        res.status(404).send("Error id "+id+" not found");
    }
    
    
});

module.exports = router;