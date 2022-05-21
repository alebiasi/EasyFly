
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var util = require("util");

const tokenChecker = function(req, res, next) {
	/*console.log(util.inspect(req.headers, {showHidden: false, depth: null}))
    console.log(util.inspect(req.params, {showHidden: false, depth: null}))
    console.log(util.inspect(req.body,{showHidden: false, depth: null}))*/
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// if there is no token
	if (!token) {
		console.log("No token");
		/*return res.status(401).send({ 
			success: false,
			message: 'No token provided.'
		});*/
		return res.status(302).redirect("/error");
	}

	// decode token, verifies secret and checks exp
	jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {			
		if (err) {
			console.log("Wrong token");
			/*return res.status(403).send({
				success: false,
				message: 'Failed to authenticate token.'
			});*/
			return res.redirect("/error").status(302);		
		} else {
			console.log("verify ok");
			// if everything is good, save to request for use in other routes
			req.loggedUser = decoded;
			next();
		}
	});
	
};

module.exports = tokenChecker