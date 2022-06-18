const express = require('express');
const router = express.Router();
const User = require('../models/user');

const mongoXlsx = require('mongo-xlsx');
const path = require('path')
let fs = require('fs');

const mail = require("../functionalities/mailTransporter");

router.get("/",(req,res)=>{
    if(req.isAuthenticated() && req.user.administrator)
        res.render('./../views/dashboard',{admin:true,loggedIn:req.isAuthenticated()});
    else
        res.status(404).render('404');
})



router.get("/downloadprofiles", (req,res)=>{
    
    if(req.isAuthenticated() && req.user.administrator)
    {

        User.find({},(err,foundUsers)=>{
            
            let allUsers=  [];
            
            foundUsers.map(x=>{
                obj = {}
                obj.EMAIL = x.email;
                obj.ROLE = x.role != null? x.role:"" ;
                obj.FULLNAME = x.profile.fullname != null? x.profile.fullname:"" ;
                obj.dob = x.personalinfo.dob!=null ? (x.personalinfo.dob).toISOString(): "";
                obj.BATCH = x.profile.batch != null? x.profile.batch:"";
                obj.COURSE = x.profile.course != null? x.profile.course:"";
                if(x.contactdetails.address.city === undefined || x.contactdetails.address.city === null)
                    obj.ADDRESS = ""
                else
                    obj.ADDRESS = x.contactdetails.address.city+","+x.contactdetails.address.state+","+x.contactdetails.address.country
                
                allUsers.push(obj);
            })
            console.log(allUsers);
            
            var model = mongoXlsx.buildDynamicModel(allUsers);
            let reqpath = path.join(__dirname, `../`);
    
    
            function removefile(path)
            {
                console.log(path)
                fs.unlink(path,(err)=>{
                    if (err)
                        throw err;
                    console.log("file deleted");
                })
            }
            
    
            function val(allUsers, model)
            {
                return new Promise((resolve)=>{
                    mongoXlsx.mongoData2Xlsx(allUsers, model, function(err, data) {
    
                        console.log('File saved at:', data.fullPath);
                        reqpath = reqpath+`${data.fullPath}`;
                        console.log("path",reqpath);
                        resolve();
                        res.download(reqpath);                     
    
                    });
                })
            }
            
            val(allUsers,model).then(()=>{
                setTimeout(()=>{
                    removefile(reqpath);
                },2000);
            })
        })
    }
    else
    {
        res.status(404).render('404');
    }
    
})



module.exports = router