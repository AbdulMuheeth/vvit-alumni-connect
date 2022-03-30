const express = require('express');
const { authenticate } = require('passport');
const router = express.Router()


const User = require("../../models/user");
var cookieSession = require('cookie-session');
const { rawListeners } = require('../../models/user');



router.get('/',(req,res)=>{
    if(req.isAuthenticated())
        res.render("authentication/profile",{user:req.user, loggedIn: req.isAuthenticated(),others:false});
    else
    {
        res.render('authentication/login',{errMsg:"Please Login to View your Profile", loggedIn: req.isAuthenticated() });
    }
})

router.get('/all',(req,res)=>{
    if(req.isAuthenticated())
    {
        User.find({},(errr,foundUsers)=>{
            res.render("authentication/profiles",{users:foundUsers, loggedIn: req.isAuthenticated(),others:false})
        })
    }
        
    else
        res.render('authentication/login',{errMsg:"Please Login to all Profile", loggedIn: req.isAuthenticated() });

})

router.post('/all',(req,res)=>{
    
    if(req.isAuthenticated())
    {
        User.find({},(errr,foundUsers)=>{
            res.render("authentication/profiles",{users:foundUsers, loggedIn: req.isAuthenticated(),others:false})
        })
    }
        
    else
        res.render('authentication/login',{errMsg:"Please Login to all Profile", loggedIn: req.isAuthenticated() });

        
})

router.get("/:pname",(req,res)=>{

    if(req.isAuthenticated())
    {
        const pname =  req.params.pname;
        User.findOne({profilename:pname},(err,foundUser)=>{
            if(!err && foundUser!=null)
            {   
                res.render("authentication/profile",{user:foundUser, loggedIn: req.isAuthenticated(),others:true});
            }
            else
                res.render("404");

        })
    }
    else
    {
        res.render('authentication/login',{errMsg:"Please Login to View Profile", loggedIn: req.isAuthenticated() });
    }
    // res.send("hi")
        
})

module.exports = router;