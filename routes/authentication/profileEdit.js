const express = require('express');
const User = require('../../models/user');
const router = express.Router();

function tm (date)
{
    if(date == null || date=='')
        return ''
    var now = date;
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    console.log(now)
    
    return now.toISOString().slice(0,10);
}

router.get('/',(req,res)=>{
    if(req.isAuthenticated())
        res.render('authentication/profileEdit',{user:req.user, dob:tm(req.user.personalinfo.dob) ,loggedIn: req.isAuthenticated() });
    else
        res.render('authentication/login',{errMsg:"Please login to continue", loggedIn: req.isAuthenticated() })
})

router.post('/', async (req,res)=>{

    if(req.isAuthenticated())
    {   
        const jobs_arr = []

        if(typeof(req.body.jobtitle) === 'object')
        {
            for(var i=0;i< Object.keys(req.body.jobtitle).length ;i++)
            {
                const job_obj = {};
                job_obj.startdate = {};
                job_obj.enddate = {};
                job_obj.title = req.body.jobtitle[Object.keys(req.body.jobtitle)[i]];
                job_obj.type = req.body.jobtype[Object.keys(req.body.jobtype)[i]];
                job_obj.company = req.body.jobcompany[Object.keys(req.body.jobcompany)[i]];
                job_obj.location = req.body.joblocation[Object.keys(req.body.joblocation)[i]];
                job_obj.startdate.month = req.body.jobjoinmonth[Object.keys(req.body.jobjoinmonth)[i]];
                job_obj.startdate.year = req.body.jobjoinyear[Object.keys(req.body.jobjoinyear)[i]];
                job_obj.enddate.month = req.body.jobleftmonth[Object.keys(req.body.jobleftmonth)[i]];
                job_obj.enddate.year = req.body.jobleftyear[Object.keys(req.body.jobleftyear)[i]];
                jobs_arr.push(job_obj);
            }
        }
        else if( typeof(req.body.jobtitle) === 'string' )
        {
            if(req.body.jobtitle != '')
            {    
                const job_obj = {};
                job_obj.startdate = {};
                job_obj.enddate = {};
                job_obj.title = req.body.jobtitle;
                job_obj.type = req.body.jobtype;
                job_obj.company = req.body.jobcompany;
                job_obj.location = req.body.joblocation;
                job_obj.startdate.month = req.body.jobjoinmonth;
                job_obj.startdate.year = req.body.jobjoinyear;
                job_obj.enddate.month = req.body.jobleftmonth;
                job_obj.enddate.year = req.body.jobleftyear;
                jobs_arr.push(job_obj);
            }   
        }


        const edu_arr = []

        if(typeof(req.body.eduschool) === 'object')
        {
            for(var i=0;i< Object.keys(req.body.eduschool).length ;i++)
            {
                const edu_obj = {};
                edu_obj.startdate = {};
                edu_obj.enddate = {};
                edu_obj.school = req.body.eduschool[Object.keys(req.body.eduschool)[i]];
                edu_obj.degree = req.body.edudegree[Object.keys(req.body.edudegree)[i]];
                edu_obj.fieldofstudy = req.body.edufieldofstudy[Object.keys(req.body.edufieldofstudy)[i]];
                edu_obj.startdate.month = req.body.edujoinmonth[Object.keys(req.body.edujoinmonth)[i]];
                edu_obj.startdate.year = req.body.edujoinyear[Object.keys(req.body.edujoinyear)[i]];
                edu_obj.enddate.month = req.body.eduendmonth[Object.keys(req.body.eduendmonth)[i]];
                edu_obj.enddate.year = req.body.eduendyear[Object.keys(req.body.eduendyear)[i]];
                edu_arr.push(edu_obj);
            }
        }
        else if( typeof(req.body.eduschool) === 'string' )
        {
            if(req.body.jobtitle != '')
            {    
                const edu_obj = {};
                edu_obj.startdate = {};
                edu_obj.enddate = {};
                edu_obj.school = req.body.eduschool;
                edu_obj.degree = req.body.edudegree;
                edu_obj.fieldofstudy = req.body.edufieldofstudy;
                edu_obj.startdate.month = req.body.edujoinmonth;
                edu_obj.startdate.year = req.body.edujoinyear;
                edu_obj.enddate.month = req.body.eduendmonth;
                edu_obj.enddate.year = req.body.eduendyear;
                edu_arr.push(edu_obj);
            }   
        }
        
        const doc = {
            "email":req.user.email,
            "role":req.user.role,
            "profileupdated":true,
            "profile.updated":true,
            "profile.willtohelp": Boolean(req.body.willtohelp),
            "profile.fullname" : req.body.fullname,
            "profile.headline": req.body.headline,
            "profile.batch":Number(req.body.batch),
            "profile.course":req.body.course,
            "profile.website": req.body.website,
            "profile.github": req.body.github,
            "profile.twitter": req.body.twitter,
            "profile.linkedin": req.body.linkedin,
            

            "professionaldetails": jobs_arr,
            "Educationaldetails": edu_arr,

            "personalinfo.updated":true,
            "personalinfo.aboutme":req.body.aboutme,
            "personalinfo.dob":new Date(req.body.dob),

            "contactdetails.address.updated":true,
            "contactdetails.address.city":req.body.city,
            "contactdetails.address.state":req.body.state,
            "contactdetails.address.country":req.body.country,
            "contactdetails.phone":Number(req.body.phone),

        }
        

        try {

            await User.updateOne(
                {email:req.body.email},
                {
                    $set:doc
                },{
                    upsert:false,
                    strict:false
                })
            
            res.redirect("/profile");
            return;
        }
        catch(error){
            console.log(error.message);
            res.send({
                success: 0,
                error: error.message
            });
        }
    }
    else
    {

        res.status(404).render('404');
    }  
})

module.exports = router