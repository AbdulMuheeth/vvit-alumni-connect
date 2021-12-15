const express = require('express');
const router = express.Router();
const Event = require('../models/event');


router.get('/newevent',(req,res)=>{
    res.render('events/eventform');
})

router.post('/newevent',(req,res)=>{


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
    
})


router.get('/',(req,res)=>{

    Event.find({},(err,foundEvents) => {
        res.render('events/events',{events : foundEvents});
    });
})

router.get('/:id',(req,res)=>{
    const post_id = req.params.id;

    Event.findById(post_id,(err,foundEvent) => {
        res.render('events/event',{event:foundEvent});
    })
    
})





module.exports = router