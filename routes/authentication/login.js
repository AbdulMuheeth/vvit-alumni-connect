const express = require('express');
const User = require('../../models/user');
const router = express.Router();
const passport = require('passport');

router.get('/',(req,res)=>{
    if(req.isAuthenticated())
        res.redirect('/secrets');
    else
        res.render("authentication/login",{errMsg:""});
})

router.post('/',(req,res)=>{

    
    passport.authenticate("local",(err,user,info)=>{
        if(err)
            console.log(err);
        if(!user)
        {
            res.render("authentication/login",{errMsg:" Email or passowrd is incorrect "});
        }
        else
        {
            if(!user.active) 
            {
                res.render('authentication/message',{msg:"notaccepted"});
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