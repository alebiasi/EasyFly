const express = require("express");
const Request = require("./request");
const util = require("util");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded());
//add a request to db
router.post("",async function(req,res){ 
    var datetime = new Date();  //get current date
    console.log(req.body.user_id+" "+req.body.document_id+" "+req.body.booking_code+" "+req.body.n_cases+" "+datetime);
    let request = new Request({ //create new request object based on data from the user
        user_id:req.body.user_id,
        document_id:req.body.document_id,
        booking_code:req.body.booking_code,
        n_cases:req.body.n_cases,
        request_time:datetime,
        status:0
    })

    await request.save();   //save the new request
    res.status(201).send('Post request arrived at server!');    //TODO redirect to correct page
});

//get all requests
router.get("",async function(req,res){
    var risposta='{"requests":[';
    var requests = await Request.find();    //get all requests from db
    requests.forEach(element => {   //create json object
        risposta+='{"user_id":"'+element.user_id+'","document_id":"'+element.document_id+'","booking_code":"'+element.booking_code+'","n_cases":"'+element.n_cases+'","request_time":"'+element.request_time+'","status":"'+element.status+'"},';
    });
    risposta+='{}]}';   
    rispostajson=JSON.parse(risposta);  //parse json object
    res.status(200).json(rispostajson); //send object
});


//get a specific request
router.get("/:id",async function(req,res){
    var id = req.params.id; //get id from req
    var request= await Request.findById(id); //find request on db   
    console.log(JSON.stringify(request));
    if(request=={}){    //if the request does not exists, send error 404 
        res.status(404).send("Request with id "+id+" not found");
    }else{//else send the json back
        res.status(200).json(request);
    }
});

router.post("/:id",function(req,res){
    res.status(504).send("Method not allowed");
});

//update a specific request
router.put("/:id",function(req,res){
    console.log("Put request with id arrived");
});

//delete a specific request
router.delete("/:id",function(req,res){
    console.log("Delete request with id arrived");
});

module.exports = router;