const express = require('express');
const router = express.Router();
const Event = require('../models/event');


function tm (date)
{
    var now = date;
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().slice(0,16);
}


router.get('/newevent',(req,res)=>{
    if(req.isAuthenticated() && req.user.administrator)
    {
        res.render('events/eventform', { loggedIn: req.isAuthenticated() });
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

        
        const event =  new Event({
            name:req.body.eventName,
            description:req.body.eventDescription,
            tag:req.body.tag,
            guests:guest_arr,
            location: req.body.location,
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
            res.redirect('/');
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
            res.render('events/events',{events : foundEvents, admin: false, loggedIn: req.isAuthenticated()});
        else
        res.render('events/events',{events : foundEvents,admin: req.user.administrator, loggedIn: req.isAuthenticated() });
        

    });
})

router.get('/:id',(req,res)=>{
    const post_id = req.params.id;

    Event.findById(post_id,(err,foundEvent) => {
        res.render('events/event',{event:foundEvent, loggedIn: req.isAuthenticated() });
    })
    
})

router.get('/edit/:id',(req,res)=>{
    if(req.isAuthenticated()  && req.user.administrator)
    {
        const post_id = req.params.id;
    

        Event.findById(post_id,(err,foundEvent) => {
    
            var startDate = tm(foundEvent.duration.start);
            var endDate = tm(foundEvent.duration.end);
            
            res.render('events/eventformedit',{event:foundEvent, startDate:startDate,endDate:endDate, loggedIn: req.isAuthenticated() });
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

            
            
            foundEvent.name = req.body.eventName,
            foundEvent.description = req.body.eventDescription,
            foundEvent.tag = req.body.tag,
            foundEvent.guests = guest_arr,
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