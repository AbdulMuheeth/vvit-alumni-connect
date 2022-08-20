const express = require("express");
const router = express.Router();

const User = require("../models/user")

router.get('/',async (req,res)=>{

    let conditions = {};
    // let update = { accessrevokedby : '' };
    let update = { $set:{profile: {image : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }} };
    let options = { multi: true, upsert: true, strict:false };

    // update_many :)
    User.updateMany(

    conditions, update, options,(err, doc) => {
        console.log(doc);
        if(!err) {
            res.redirect('/home');
        }
        else {
            if(err.name == "ValidationError"){
            // handleValidationError(err , req.body);
            res.redirect('/home');
        }else {
            res.redirect('/');
        }
        }
    });

})

module.exports = router