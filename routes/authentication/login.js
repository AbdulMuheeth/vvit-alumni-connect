const express = require('express');
const User = require('../../models/user');
const router = express.Router();
const passport = require('passport');

router.get('/',(req,res)=>{
    if(req.isAuthenticated())
        res.redirect('/secrets');
    else
        res.render('authentication/login');
})

router.post('/',(req,res)=>{
    
    const user = new User({             
        username : req.body.username,
        password : req.body.password
    });

    req.login(user,(err)=>{            
        if(err)           
            console.log(err);
        else
        {
            passport.authenticate("local")(req,res,()=>{
                res.redirect('/secrets');
            })
        }
    })
})

module.exports = router;