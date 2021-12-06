const express = require('express');
const router = express.Router();
const User = require('../../models/user');


router.get('/',(req,res)=>{
    console.log(req.user);
    if(req.isAuthenticated())
    {
        // console.log(req.user);
        // console.log(req.user.administrator);
        if(req.user.active && req.user.administrator)
        {
            User.find({"active" : {$ne:true}},(err,foundUser)=>{
                res.render('authentication/verify',{usersToBeVerified : foundUser});
            })
        }
        else
        {
            res.send("You are not authorized");
        }
    }
})

router.post('/',(req,res)=>{

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
})


module.exports = router;