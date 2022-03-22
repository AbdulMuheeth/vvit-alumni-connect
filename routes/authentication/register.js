const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const passport = require('passport');

router.get('/',(req,res)=>{
    if(req.isAuthenticated())
        res.render('authentication/message',{msg:"loggedin", loggedIn: req.isAuthenticated() });
    else
        res.render("authentication/register",{errMsg:"", loggedIn: req.isAuthenticated() }); 
        
})

router.post('/',(req,res)=>{
    const user = new User({
        fullname:req.body.fullname,
        username:req.body.username,
        profilename:req.body.uname,
        role:req.body.role,
        address:req.body.address,
        phone:req.body.phone
    })
    
    User.register(user,req.body.password,(err,user)=>{     // passport method // it is used add new credentials to the db
        if(err)
        {
            console.log(err);
            res.render('authentication/register',{errMsg : err, loggedIn: req.isAuthenticated() });
        }
        else
        {
            
           res.render('authentication/login',{errMsg:"please login!", loggedIn: req.isAuthenticated() })

        }
    })

})

module.exports = router;