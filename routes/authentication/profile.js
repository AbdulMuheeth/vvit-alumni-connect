const express = require('express');
const { authenticate } = require('passport');
const router = express.Router()


router.get('/',(req,res)=>{
    if(req.isAuthenticated())
        res.render("authentication/profile",{user:req.user});
    else
    {
        res.render('authentication/login',{errMsg:"Please Login to View your Profile"});
    }
})

module.exports = router;