const jwt = require('jsonwebtoken')
const User = require('../model/userModel')




const  checkUser = (req ,res ,next) => {
	const token = req.cookies.jwt
	if(token){
	   jwt.verify(token, 'impact week project' ,(err, decodedToken)=> {
	        if(err){
                res.locals.user =  null
                next()
	        }
	        if(decodedToken){
		        User.findById(decodedToken.id)
		            .then((user) => {
                        const {userName ,email, id} = user
                        res.locals.user =  {userName, email, id}
                        next()
		            })
                    .catch(err => {
                        res.locals.user = null;
                        next();
                    })
	        }
	    
	    }) 
	}
	else{
	   res.locals.user =  null
	   next()
	}
}
     
const isLogin = (req, res, next) => {
    const token = req.cookies.jwt;

    //check json web token is valid
    if (token) {
        jwt.verify(token, 'impact week project', (err, decodedToken) => {
            if (err) {
                res.redirect("/login");
            } else {
                next();
            }
        });
    } else {
        res.redirect("/login");
    }
};


module.exports = {
    checkUser,
	isLogin
}