const express = require("express");
const util = require("util");
const router = express.Router();
const path = require('node:path');
router.use(express.json());
router.use(express.urlencoded());

router.use("",function(req,res){
    var mypath = path.join(__dirname,"../static/accept_page.html");
    console.log(mypath);
    res.sendFile(mypath);
});
module.exports = router;