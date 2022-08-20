const express = require('express');
const router = express.Router();
const User = require('../../models/user');


router.get('/',(req,res)=>{
    if(req.isAuthenticated() && req.user.active && (req.user.administrator || req.user.moderator))
    {
        User.find({"active" : {$ne:true}},(err,foundUser)=>{
            res.render('authentication/verify',{user: req.user,usersToBeVerified : foundUser, loggedIn: req.isAuthenticated()});
        })
    }
    else
    {
        res.status(404).render('404');
    }
})

router.post('/',(req,res)=>{

    if(req.isAuthenticated() && req.user.active && (req.user.administrator || req.user.moderator))
    {
        User.findById(req.body.userid,(err,foundUser)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                foundUser.active = true;
                foundUser.save(()=>{
                    res.redirect('/verify')
                })
            }
        })
    }
    else
    {
        res.status(404).render('404');
    }
})


module.exports = router;