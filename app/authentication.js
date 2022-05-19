const express = require('express');
//definisco un router per gestire gli instradamenti
const router = express.Router();
//recupero il modello user per ottenere la mia collezione su mongodb
const User = require('./models/user');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

//route di login
router.post('/login', async function(req,res){
    // cerco l'utente tramite email
	let user = await User.findOne({
		email: req.body.email
	}).exec();

    // user not found
	if (!user) {
		res.json({ success: false, message: 'Authentication failed. User not found.' });
	}

	// check if password matches
	if (user.password != req.body.password) {
		res.json({ success: false, message: 'Authentication failed. Wrong password.' });
	}

    // if user is found and password is right create a token
	var payload = {
		email: user.email,
		id: user._id
		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    
    res.json({
		success: true,
		message: 'Token creato!',
		token: token,
		email: user.email,
		id: user._id,
		self: "api/v1/" + user._id
	});
});

//route di registrazione
router.post('/registration', async function(req,res){
    //creo un nuovo utente
	let newUser = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        createdAt: Date.now()
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

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

module.exports = router;