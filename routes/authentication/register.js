const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const passport = require('passport');
const mail = require('../../functionalities/mailTransporter');

function tm (date)
{
    var now = date;
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().slice(0,16);
}


router.get('/',(req,res)=>{
    if(req.isAuthenticated())
        res.render('authentication/message',{msg:"loggedin", loggedIn: req.isAuthenticated() });
    else
        res.render("authentication/register",{errMsg:"", loggedIn: req.isAuthenticated() }); 
        
})

router.post('/',(req,res)=>{
    

    const user = new User({
        email:req.body.email,
        username:req.body.username,
        role:req.body.role,
        regid:req.body.regid,
        personalinfo:{dob:new Date(req.body.dob)}
    })

    
    User.register(user,req.body.password,(err,user)=>{     // passport method // it is used add new credentials to the db
        if(err)
        {
            console.log(err);
            res.render('authentication/register',{errMsg : err, loggedIn: req.isAuthenticated() });
        }
        else
        {
            
            const obj = {...(user._doc)}
            obj.password = req.body.password;
            obj.dob = tm(new Date(req.body.dob));
            console.log(obj)
        
            mail.sendanemail(req.body.email,"newuser",obj);
            res.render('authentication/login',{errMsg:"please login!", loggedIn: req.isAuthenticated() })

        }
    })

})

module.exports = router;