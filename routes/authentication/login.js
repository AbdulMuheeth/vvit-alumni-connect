const express = require('express');
const User = require('../../models/user');
const router = express.Router();
const passport = require('passport');

router.get('/',(req,res)=>{
    if(req.isAuthenticated())
        res.render('authentication/message',{user: req.user,msg:"loggedin", loggedIn: req.isAuthenticated() });
    else
        res.render("authentication/login",{user: req.user,errMsg:"", loggedIn: req.isAuthenticated() });
})

router.post('/',(req,res)=>{

    
    passport.authenticate("local",(err,user,info)=>{
        if(err)
            console.log(err);
        if(!user)
        {
            res.render("authentication/login",{user: req.user,errMsg:" Email or passowrd is incorrect ", loggedIn: req.isAuthenticated() });
        }
        else
        {
            if(!user.active) 
            {
                res.render('authentication/message',{user: req.user,msg:"notaccepted", loggedIn: req.isAuthenticated() });
            }
            else{
            req.login(user,(err)=>{            
                if(err)           
                    console.log(err);
                else
                res.redirect('/home');
            })
        }
        }
    })(req,res,()=>{
            res.redirect('/secrets');
    })
})

module.exports = router;