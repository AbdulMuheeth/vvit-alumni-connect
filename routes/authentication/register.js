const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const passport = require('passport');

router.get('/',(req,res)=>{
    if(req.isAuthenticated())
        res.redirect('/secrets');
    else
        res.render("authentication/register",{errMsg:""}); 
        
})

router.post('/',(req,res)=>{
    console.log(req.body);
    const user = new User({
        fullname:req.body.fullname,
        username:req.body.username,
        role:req.body.role,
        address:req.body.address,
        phone:req.body.phone
    })
    
    User.register(user,req.body.password,(err,user)=>{     // passport method // it is used add new credentials to the db
        if(err)
        {
            console.log(err);
            res.render('authentication/register',{errMsg : err});
        }
        else
        {
           res.render('authentication/login',{errMsg:"please login!"})

        }
    })

})

module.exports = router;