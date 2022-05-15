const express = require("express");
const Request = require("./request");
const util = require("util");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded());

router.post("",function(req,res){
    console.log("Post requests arrived!");
    console.log("Heders:");
    console.log(util.inspect(req.headers, {showHidden: false, depth: null}))
    console.log("Url:");
    console.log(util.inspect(req.url, {showHidden: false, depth: null}))
    console.log("query:");
    console.log(util.inspect(req.query, {showHidden: false, depth: null}))
    console.log("body:");
    console.log(util.inspect(req.body, {showHidden: false, depth: null}))
    res.status(201).send('Post request arrived at server!');
});

router.get("",function(req,res){
    console.log("Get request arrived");
});

router.put("",function(req,res){
    console.log("Put request arrived");
});

router.delete("",function(req,res){
    console.log("Delete request arrived");
});

router.get("/:id",function(req,res){
    console.log("Get request with id arrived");
    res.status(200).send("Arrived correctly!");
});

router.post("/:id",function(req,res){
    res.status(504).send("Method not allowed");
});

router.put("/:id",function(req,res){
    console.log("Put request with id arrived");
});

router.delete("/:id",function(req,res){
    console.log("Delete request with id arrived");
});

module.exports = router;