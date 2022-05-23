const express = require('express');
const router = express.Router();
/*const cookieParser = require("cookie-parser"); 

router.use(cookieParser());*/

router.post('/logout', async function(req,res){

    /* // get login cookie
    var cookie = req.cookies.loginCookie;

    // user not logged
    if(!cookie)
    {
        return res.status(401).send({ 
            success: false,
            message: 'Cookie not found'
        });
    }
    else {
        // destroy cookie to logout
        try {
            await res.clearCookie('loginCookie');
        }
        catch (err) {
            return res.status(403).send({ 
                success: false,
                message: 'Failed to logout.'
            });
        }  
	}*/

    // check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// if there is no token
	if (!token) {
        /*return res.status(401).send({ 
			success: false,
			message: 'No token provided.'
		});*/
        // redirect to main page
		return res.status(401).redirect("/login?error=notLogged");
	}

    // redirect to main page and token will be cleared in script.js
    res.status(200).redirect("/main_page");

});

module.exports = router;