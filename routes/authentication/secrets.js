const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    if(req.isAuthenticated())
        res.send('You are authenticated!');
    else{
        res.render('authentication/login',{errMsg:""});
    }
})

module.exports = router;
