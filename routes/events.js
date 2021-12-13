const express = require('express');
const router = express.Router();
const Event = require('../models/event');

router.get('/',(req,res)=>{
    
    // const event = new Event ({
    //     name: "viva vvit",
    //     description: "the fest has come ",
    //     duration:{
    //         start: Date.now(),
    //         end: 24/2/2021,
    //     },
    //     guests:{
    //         guestname:"Hero",
    //         guestfield:"Actor"
    //     }
    // })

    // event.save(()=>{
    //     console.log("event saved");
    // })
    // User.find({"active" : {$ne:true}},(err,foundUser)=>{
    Event.find({},(err,foundEvents) => {
        res.render('events/events',{events : foundEvents});
        // console.log(foundEvents);
        // res.send("hi there");

    });
})

router.get('/:id',(req,res)=>{
    const post_id = req.params.id;

    Event.findById(post_id,(err,foundEvent) => {
        res.render('events/event',{event:foundEvent});
    })
    
})

module.exports = router