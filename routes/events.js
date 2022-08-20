const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const User = require("../models/user");

const mail = require("../functionalities/mailTransporter");

function tm (date)
{
    var now = date;
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().slice(0,16);
}


router.get('/newevent',(req,res)=>{
    if(req.isAuthenticated() && req.user.administrator)
    {
        res.render('events/eventform', { user: req.user,loggedIn: req.isAuthenticated() });
    }
    else
    {
        res.status(404).render('404');
    }
})

router.post('/newevent',(req,res)=>{

    if(req.isAuthenticated()  && req.user.administrator)
    {   
        const guest_arr = []

        if(typeof(req.body.guestName) === 'object')
        {
            for(var i=0;i< Object.keys(req.body.guestName).length ;i++)
            {
                const guest_obj = {}
                guest_obj.guestname = req.body.guestName[Object.keys(req.body.guestName)[i]];
                guest_obj.guestimage = req.body.guestImage[Object.keys(req.body.guestImage)[i]];
                guest_obj.guestfield = req.body.guestProfession[Object.keys(req.body.guestProfession)[i]];
                guest_obj.profile = {
                    facebook : req.body.facebook[Object.keys(req.body.facebook)[i]],
                    instagram : req.body.instagram[Object.keys(req.body.instagram)[i]],
                    twitter :req.body.twitter[Object.keys(req.body.twitter)[i]]
                }
                guest_arr.push(guest_obj);
            }
        }
        else if( typeof(req.body.guestName) === 'string' )
        {
            
            if(req.body.guestName != '')
            {    
                const guest_obj = {}    
                guest_obj.guestname = req.body.guestName;
                guest_obj.guestimage = req.body.guestImage;
                guest_obj.guestfield = req.body.guestProfession;
                guest_obj.profile = {
                    facebook : req.body.facebook,
                    instagram : req.body.instagram,
                    twitter :req.body.twitter
                }
                guest_arr.push(guest_obj);
            }   
        }


        const image_gallery_arr = []

        if(typeof(req.body.image) === 'object')
        {
            for(var i=0;i< Object.keys(req.body.image).length ;i++)
            {
                if(req.body.image[Object.keys(req.body.image)[i]] != '')
                    image_gallery_arr.push(req.body.image[Object.keys(req.body.image)[i]]);
            }
        }
        else if( typeof(req.body.guestName) === 'string' )
        {
            if(req.body.image != '')
                image_gallery_arr.push(req.body.image); 
        }
        
        let receivers = [];
        if(typeof(req.body.emailreceiver) === 'object')
        {
            receivers = [...req.body.emailreceiver];
        }
        else if(typeof(req.body.guestName) === 'string' )
        {
            receivers.push(req.body.emailreceiver);
        }
        console.log(receivers)
        
        var status = 'upcoming'
        const startDate = new Date(req.body.startDate)
        const endDate = new Date(req.body.endDate)
        const current = new Date()
        if(endDate < current)
        {
            status = 'past'
        }
        else if(startDate < current && endDate > current)
        {
            status = 'ongoing'
        }
        else if(startDate > current)
        {
            status = 'upcoming'
        }

        console.log(status);

        const event =  new Event({
            name:req.body.eventName,
            description:req.body.eventDescription,
            tag:req.body.tag,
            guests:guest_arr,
            location: req.body.location,
            status:status,
            duration : {
                start:new Date(req.body.startDate),
                end: new Date(req.body.endDate)
            } ,
            images:{
                profile:req.body.profileImage,
                gallery:image_gallery_arr
            },
        })

        event.save((err)=>{
            if(err)
            {
                console.log(err);
                return;
            }
            res.redirect('/events');
        })

        // sending email's
        User.find({role:{$in:receivers}},(err,foundUsers)=>{   
            listOfEmails = []
            foundUsers.map(x=>{
                listOfEmails.push(x.email);
            })
            // console.log(listOfEmails.toString());
            let val = {...(event._doc)};
            console.log(val);
            val.duration.start = tm(event.duration.start);
            console.log(val);

            // res.send(listOfEmails);  
            mail.sendanemail(listOfEmails.toString(),"event",val);
            console.log(event);
        })
        }
        else
        {
                res.status(404).render('404');
    }  
})


router.get('/',(req,res)=>{

    Event.find({},(err,foundEvents) => {
        if(req.user === undefined)
            res.render('events/events',{user: req.user,events : foundEvents, admin: false, loggedIn: req.isAuthenticated()});
        else
            res.render('events/events',{user: req.user,events : foundEvents,admin: req.user.administrator, loggedIn: req.isAuthenticated() });
        

    });
})

router.get('/:id',(req,res)=>{
    const event_id = req.params.id;

    Event.findById(event_id,(err,foundEvent) => {
        if(req.user === undefined)
            res.render('events/event',{user: req.user,event:foundEvent, admin:false ,loggedIn: req.isAuthenticated() });
        else
            res.render('events/event',{user: req.user,event:foundEvent, admin:req.user.administrator ,loggedIn: req.isAuthenticated() });
    })
    
})

router.delete('/:id',async (req,res)=>{
    const event_id = req.params.id;

    await Event.findByIdAndDelete(event_id,(err)=>{
        if(err)
            console.log(err);
        else
            res.redirect('/events');
    })

})

router.get('/edit/:id',(req,res)=>{
    if(req.isAuthenticated()  && req.user.administrator)
    {
        const post_id = req.params.id;
    

        Event.findById(post_id,(err,foundEvent) => {
    
            var startDate = tm(foundEvent.duration.start);
            var endDate = tm(foundEvent.duration.end);
            
            res.render('events/eventformedit',{user: req.user,event:foundEvent, startDate:startDate,endDate:endDate, loggedIn: req.isAuthenticated() });
        })
    }
    else
    {
        res.status(404).render('404');
    }  
})

router.put('/edit/:id',(req,res)=>{

    if(req.isAuthenticated() && req.user.administrator)
    {

        Event.findById(req.params.id,(err,foundEvent)=>{
            const guest_arr = []

            if(typeof(req.body.guestName) === 'object')
            {
                for(var i=0;i< Object.keys(req.body.guestName).length ;i++)
                {
                    const guest_obj = {}
                    guest_obj.guestname = req.body.guestName[Object.keys(req.body.guestName)[i]];
                    guest_obj.guestimage = req.body.guestImage[Object.keys(req.body.guestImage)[i]];
                    guest_obj.guestfield = req.body.guestProfession[Object.keys(req.body.guestProfession)[i]];
                    guest_obj.profile = {
                        facebook : req.body.facebook[Object.keys(req.body.facebook)[i]],
                        instagram : req.body.instagram[Object.keys(req.body.instagram)[i]],
                        twitter :req.body.twitter[Object.keys(req.body.twitter)[i]]
                    }
                    guest_arr.push(guest_obj);
                }
            }
            else if( typeof(req.body.guestName) === 'string' )
            {
                
                if(req.body.guestName != '')
                {    
                    const guest_obj = {}    
                    guest_obj.guestname = req.body.guestName;
                    guest_obj.guestimage = req.body.guestImage;
                    guest_obj.guestfield = req.body.guestProfession;
                    guest_obj.profile = {
                        facebook : req.body.facebook,
                        instagram : req.body.instagram,
                        twitter :req.body.twitter
                    }
                    guest_arr.push(guest_obj);
                }   
            }


            const image_gallery_arr = []

            if(typeof(req.body.image) === 'object')
            {
                for(var i=0;i< Object.keys(req.body.image).length ;i++)
                {
                    if(req.body.image[Object.keys(req.body.image)[i]] != '')
                        image_gallery_arr.push(req.body.image[Object.keys(req.body.image)[i]]);
                }
            }
            else if( typeof(req.body.guestName) === 'string' )
            {
                if(req.body.image != '')
                    image_gallery_arr.push(req.body.image); 
            }

            var status = 'upcoming'
            const startDate = new Date(req.body.startDate)
            const endDate = new Date(req.body.endDate)
            const current = new Date()
            if(endDate < current)
            {
                status = 'past'
            }
            else if(startDate < current && endDate > current)
            {
                status = 'ongoing'
            }
            else if(startDate > current)
            {
                status = 'upcoming'
            }
            
            
            foundEvent.name = req.body.eventName,
            foundEvent.description = req.body.eventDescription,
            foundEvent.tag = req.body.tag,
            foundEvent.guests = guest_arr,
            foundEvent.status = status,
            foundEvent.location = req.body.location,
            foundEvent.duration = {
                    start:new Date(req.body.startDate),
                    end: new Date(req.body.endDate)
            },
            foundEvent.images = {
                    profile:req.body.profileImage,
                    gallery:image_gallery_arr
            }
        
            foundEvent.save((err)=>{
                if(err)
                {
                    console.log(err);
                    return;
                }
                res.redirect('/events/'+foundEvent._id);
            })
            
        })
    }
    else
    {
        res.status(404).render('404');
    }
})



                        


module.exports = router