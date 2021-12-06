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
            res.send("Credentials are not crt");
        }
        else
        {
            if(!user.active) 
                res.send("You request is yet to be accepted");
            else{
            req.login(user,(err)=>{            
                if(err)           
                    console.log(err);
                else
                res.redirect('/secrets');
            })
        }
        }
    })(req,res,()=>{
            res.redirect('/secrets');
    })
})

module.exports = router;