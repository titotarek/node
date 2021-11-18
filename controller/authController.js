const emailValidator = require('email-validator')
const User = require('../model/userModel')
const bcrypt = require('bcrypt')
const {createToken} = require('../middleware/createToken')



//login page function
const login = async (req, res) => {
    if (req.method === 'GET') {
        res.render('logIn')

    }
    if (req.method === 'POST') {
        const {email , password } = req.body
        let errors = [] ;
        if(!email || !password){
            errors.push({msg : 'Please fill all fields'})
        }
        if(email && !emailValidator.validate(email)){
            errors.push({msg : 'Email is not validate '})
        }
        //check pass length 
        if (password && password.length < 6) {
            errors.push({ msg: 'Password should be more than 6 character' })
        }
        if(errors.length > 0){
            res.render('logIn', {
                errors,
                email,
                password,
            })
        
        }else{
            user = await User.findOne({email: email})
            if(!user){
                errors.push({ msg: 'Email is not exist' })
                res.render('logIn', {
                    errors,
                    email,
                    password,
                })
            }else{
                const match = await bcrypt.compare(password , user.password)
                if(!match){
                    errors.push({ msg: 'Password is not correct' })
                    res.render('login', {
                        errors,
                        email,
                        password,
                    })
                }else{
                    const token = createToken(user._id)
                    res.cookie('jwt' , token , { httpOnly: true , maxAge : 3 * 24 * 60 * 60 * 1000})
                    res.redirect('/')
                }

            }
        }
        
    }
}


//signup page function
const signup = async (req, res) => {
    if(req.method === 'GET') {
        res.render('SignUp')
    }

    if(req.method === 'POST') {
        const {userName , email , password , password2} = req.body
        let errors = [] ;
        
        if(!userName || !email || !password || !password2){
            errors.push({msg : 'Please fill all fields'})
        }
        if(email && !emailValidator.validate(email)){
            errors.push({msg : 'Email is not validate '})
        }
        //check username length 
        if (userName && userName.length < 4) {
            errors.push({ msg: 'Username should be more than 4 character' })
        }
        //check pass length 
        if (password && password.length < 6) {
            errors.push({ msg: 'Password should be more than 6 character' })
        }
        if(password !== password2){
            errors.push({ msg: 'Passwords do not match' })
        }
        if(errors.length > 0){
            res.render('signUp', {
                errors,
                email,
                password,
                userName,
                password2
            })
        }else{
            const user = await User.findOne({email: email})
            if(user){
                errors.push({ msg: 'Email is already registered' })
                res.render('signUp',{
                    errors,
                    email,
                    password,
                    userName,
                    password2
                })
            } else { 
                const newUser = new User({
                    userName,
                    email,
                    password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, async (err, hash) => {
                        if (err) console.log(err);
                        //set password to hash
                        newUser.password = hash;
                        //save user
                        await newUser.save()
                        res.redirect('/login')  
                    })
                });
            }  
        }
    }
}

//log out page function
const logout = (req, res) => {
    res.cookie('jwt', '', {httpOnly: true, maxAge: 1})
    res.redirect('/login')
}



module.exports = {
    login,
    signup,
    logout
}