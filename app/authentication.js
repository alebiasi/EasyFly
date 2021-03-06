const express = require('express');
//definisco un router per gestire gli instradamenti
const router = express.Router();
//recupero il modello user per ottenere la mia collezione su mongodb
const User = require('./models/user');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require("mongoose");

//route di login
router.post('/login', async function(req,res){
    // cerco l'utente tramite email
	let user = await User.findOne({
		email: req.body.email
	}).exec();

    // user not found
	if (!user) {
		//res.json({ success: false, message: 'Authentication failed. User not found.' }).redirect("/login?error=user");
        res.status(400).redirect("/login?error=user");
        return;
	}

	// check if password matches
	if (user.password != req.body.password) {
		//res.json({ success: false, message: 'Authentication failed. Wrong password.' }).redirect("/login?error=psw");
        res.status(400).redirect("/login?error=psw");
        return;
	}

    // if user is found and password is right create a token
	var payload = {
		email: user.email,
		id: user._id,
		admin: user.admin

		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    
	// Create a cookies object to know the user is logged
	/*res.cookie('loginCookie', token, {
		duration: 1000*60*180	// expires in 3 hours
	});

    res.json({

		success: true,
		message: 'Token creato!',
		token: token,
		email: user.email,
		id: user._id,
		self: "api/v1/" + user._id
	});*/
	res.status(200).redirect("/main_page?token="+token);
});

//route di registrazione
router.post('/registration', async function(req,res){
    //creo un nuovo utente
	let newUser = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        createdAt: Date.now(),
		admin: false
    });

    //verifico che non esita già un utente con una certa mail
    let user = await User.findOne({
		email: req.body.email
	}).exec();
    if (user) {
		//res.status(400).json({ error: 'Esiste già un utente con questo indirizzo email' });
        res.status(400).redirect("/register?error=user");
        return;
	}
    //controllo la correttezza dei campi
    if (!newUser.email || !newUser.name || !newUser.surname || typeof newUser.email != 'string' || !checkIfEmailInString(newUser.email)) {
        //res.status(400).json({ error: 'Non tutti i campi sono stati compilati correttamente' });
        res.status(400).redirect("/register?error=incorrect");
        return;
    }

    //memorizzo il nuovo utente
    newUser = await newUser.save();
    let userId = newUser.id;
    res.status(201).redirect("/login"); //reindirizzo ad una pagina di login


});

//route di registrazione utente amministratore
router.post('/registration/admin', async function(req,res){
    //creo un nuovo utente admin
	let newUser = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        createdAt: Date.now(),
		admin: true
    });

    //verifico che non esita già un utente con una certa mail
    let user = await User.findOne({
		email: req.body.email
	}).exec();
    if (user) {
		res.status(400).json({ error: 'Esiste già un utente con questo indirizzo email' });
        return;
	}
    //controllo la correttezza dei campi
    if (!newUser.email || !newUser.name || !newUser.surname || typeof newUser.email != 'string' || !checkIfEmailInString(newUser.email)) {
        res.status(400).json({ error: 'Non tutti i campi sono stati compilati correttamente' });
        return;
    }

    //memorizzo il nuovo utente
    newUser = await newUser.save();
    let userId = newUser.id;
    res.location("/api/v1/authentication/front" + userId).status(201).send();

});

router.get("/users/:id",async function(req,res){
    var id = req.params.id;
    try{    //if the given id is not on the correct format mongoose throws an error
        var mongoid = new mongoose.mongo.ObjectId(id);    //get mongoose id format
        var user= await User.findById(mongoid); //find user on db   
        if(user==null){    //if the request does not exists, send error 404 
            res.status(404).send("Error id "+id+" not found");
        }else{//else send the json back
            var myjson ={
                name:user.name,
                surname:user.surname,
                email:user.email
            };
            res.status(200).json(myjson);
        }
    }catch(error){
        res.status(404).send("Error id "+id+" not found");
    }
});

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

module.exports = router;