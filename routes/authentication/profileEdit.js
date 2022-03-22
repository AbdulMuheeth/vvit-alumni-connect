const express = require('express');
const User = require('../../models/user');
const router = express.Router();

router.get('/',(req,res)=>{
    if(req.isAuthenticated())
        res.render('authentication/profileEdit',{user:req.user, loggedIn: req.isAuthenticated() });
    else
        res.render('authentication/login',{errMsg:"Please login to continue", loggedIn: req.isAuthenticated() })
})

router.post('/',(req,res)=>{
    if(req.isAuthenticated())
    {
        User.findById(req.user.id,(err,foundUser)=>{    // checking id of the user through user method provided PASSPORT
            if(err)
                console.log(err);
            else
            {
                if(foundUser)
                {
                    foundUser.occupation = req.body.work;
                    foundUser.socialmedia.website = req.body.websiteurl;
                    foundUser.socialmedia.github = req.body.github;
                    foundUser.socialmedia.twitter = req.body.twitter;
                    foundUser.socialmedia.linkedin = req.body.linkedin;
                    foundUser.willtohelp = req.body.willtohelp;
                    foundUser.fullname = req.body.fullname;
                    foundUser.username = req.body.email;
                    foundUser.address = req.body.address;
                    foundUser.phone = req.body.phone;
                    foundUser.aboutyourself = req.body.aboutyourself;

                    foundUser.save(()=>{                        
                        res.redirect("/profile");
                    })
                }
            }
        })
    }
    else
        res.render('authentication/login',{errMsg:"Please login to continue", loggedIn: req.isAuthenticated() })
})

module.exports = router