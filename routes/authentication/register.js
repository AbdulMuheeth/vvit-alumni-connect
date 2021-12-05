const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const passport = require('passport');

router.get('/',(req,res)=>{
    if(req.isAuthenticated())
        res.redirect('/secrets');
    else
        res.render('authentication/register');
})

router.post('/',(req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email:req.body.email
      })
    User.register(newUser,req.body.password,(err,user)=>{     // passport method // it is used add new credentials to the db
        if(err)
        {
            console.log(err);
            res.redirect("/register");
        }
        else
        {
            passport.authenticate("local") (req,res,()=>{       // authenticate local is used to create/generate a cookie
                res.redirect('/secrets');                       // which is can be used for cookie authentication
            })

        }
    })

})

module.exports = router;