const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser"); 

router.use(cookieParser());

router.post('/logout', async function(req,res,next){

    // get login cookie
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
	}

    res.json({
		success: true,
		message: 'Logout effettuato',
	});
});

module.exports = router;