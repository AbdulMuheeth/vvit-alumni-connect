const express = require('express');
const { authenticate } = require('passport');
const router = express.Router()


const User = require("../../models/user");
var cookieSession = require('cookie-session');
const { rawListeners } = require('../../models/user');

function tm (date)
{
    if(date == null || date=='')
        return ''
        
    var now = date;
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().slice(0,16);
}

router.get('/',(req,res)=>{
    if(req.isAuthenticated())
    {
        if(req.user.profileupdated)
        {   
            res.render("authentication/profile",{user:req.user, loggedIn: req.isAuthenticated(),others:false});
        }
        else
        {   
            
            if( !req.user.profile.updated && !req.user.personalinfo.updated && !req.user.contactdetails.address.updated)
            {
                res.redirect('/editprofile');
            }
            else
            {
                User.updateOne({email:req.user.email},{$set:{profileupdated:true}});
                res.render("authentication/profile",{user:req.user, loggedIn: req.isAuthenticated(),others:false});
            }
        }

    }
    else
    {
        
        res.render('authentication/login',{errMsg:"Please Login to View your Profile", loggedIn: req.isAuthenticated() });
    }
})

router.get('/all',(req,res)=>{
    
    if(req.isAuthenticated())
    {
        if(req.cookies.filter !== undefined)
        {
            
            filter_obj = req.cookies.filter
            filter_doc = {}
            and_arr = []
            if(filter_obj.name_role !== undefined)
            {   
                obj = filter_obj.name_role
                name_or = []
                name_or.push({"profile.fullname":{$regex: obj.nameoremail,$options:"$i"}})
                name_or.push({"email":{$regex: obj.nameoremail,$options:"$i"}})
                and_arr.push({$or : name_or})
                and_arr.push({ role :{$regex:obj.role,$options:"$i"} }) 
                filter_doc.$and = and_arr 
            }
            if(filter_obj.year_course !== undefined)
            {
                obj = filter_obj.year_course
                course_or = []
                if(obj.year != "" )
                    course_or.push({"profile.batch":obj.year})
                if(obj.course != "" )
                    course_or.push({"profile.course":obj.course})
                and_arr.push({$or : course_or})
                filter_doc.$and = and_arr 
            }
            if(filter_obj.city_country !== undefined)
            {
                obj = filter_obj.city_country
                address_or = []
                if(obj.city != "" )
                    address_or.push({"contactdetails.address.city":{$regex:obj.city,$options:"$i"}})
                if(obj.country != "" )
                    address_or.push({"contactdetails.address.country":{$regex:obj.country,$options:"$i"}})
                and_arr.push({$or : address_or})
                filter_doc.$and = and_arr 
            }
            if(filter_obj.company_experience !== undefined)
            {
                obj = filter_obj.company_experience
                exp_or = []
                exp_or.push({"professionaldetails.company":{$regex:obj.company,$options:"$i"}})
                // exp_or.push({})
                and_arr.push({$or : exp_or})
                filter_doc.$and = and_arr 
            }
            if(filter_obj.specialization !== undefined)
            {
                obj = filter_obj.specialization
                spec_or = []
                if(obj.specialization != "" )
                    spec_or.push({"Educationaldetails.degree":{$regex:obj.specialization,$options:"$i"}})
                if(obj.college != "" )
                    spec_or.push({"Educationaldetails.school":{$regex:obj.college,$options:"$i"}})
                if(obj.fieldofstudy != "" )
                    spec_or.push({"Educationaldetails.fieldofstudy":{$regex:obj.fieldofstudy,$options:"$i"}})
                and_arr.push({$or : spec_or})
                filter_doc.$and = and_arr
            }
            

            User.find(filter_doc,(err,foundUsers)=>{
                if(!err)
                {
                    res.render("authentication/profiles",{users:foundUsers,filterapplied:true,loggedIn: req.isAuthenticated(),others:false})
                }
                else
                    console.log("render "+err)
            })
        }
        else
        {
            User.find({},(err,foundUsers)=>{
                res.render("authentication/profiles",{users:foundUsers,filterapplied:false, loggedIn: req.isAuthenticated(),others:false})
            })
        }      
    }
        
    else
    {
        res.render('authentication/login',{errMsg:"Please Login to all Profile", loggedIn: req.isAuthenticated() });
    }

})

router.post('/all',(req,res)=>{
    
    if(req.isAuthenticated())
    {
        
        filter_obj = {}
        if(req.body.filterprop == "name_role")
        {
            filter_obj.name_role = {nameoremail:req.body.nameoremail,role:req.body.role}
        }
        else if(req.body.filterprop == "year_course")
        {
            filter_obj.year_course = {year:req.body.year,course:req.body.course}
        }
        else if(req.body.filterprop == "city_country")
        {
            filter_obj.city_country = {city:req.body.city,country:req.body.country}
        }
        else if(req.body.filterprop == "company_experience")
        {
            filter_obj.company_experience = {company:req.body.company,experience:req.body.experience}
        }
        else if(req.body.filterprop == "specialization")
        {
            filter_obj.specialization = {specialization:req.body.specialization,college:req.body.college,fieldofstudy:req.body.fieldofstudy}
        }
        
        res.cookie('filter',filter_obj)
        
        
        res.redirect('/profile/all');
    }
        
    else
        res.render('authentication/login',{errMsg:"Please Login to all Profile", loggedIn: req.isAuthenticated() });
        
})
router.get('/clearfilter',(req,res)=>{
    
    if(req.cookies.filter !== undefined)
        res.clearCookie("filter");
    
    res.redirect("/profile/all");
})


router.get("/:pname",(req,res)=>{

    if(req.isAuthenticated())
    {
        const pname =  req.params.pname;
        User.findOne({username:pname},(err,foundUser)=>{
            if(!err && foundUser!=null)
            {   
                res.render("authentication/profile",{user:foundUser, loggedIn: req.isAuthenticated(),others:true});
            }
            else
                res.render("404");

        })
    }
    else
    {
        res.render('authentication/login',{errMsg:"Please Login to View Profile", loggedIn: req.isAuthenticated() });
    }
        
})

module.exports = router;