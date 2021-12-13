const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    tag:{type:String,required:true,default:"this is the tagline of the event"},
    guests:[{
        guestname : {type:String,required:true,default:"None"},
        guestimage : {type:String,required:true,default:"https://images.all-free-download.com/images/graphicwebp/hero_kid_icon_superman_costume_cute_cartoon_character_6845147.webp"},
        guestfield:{type:String,required:true},
        profile: {
            facebook:{type:String,required:true,default:"None"},
            instagram : {type:String,required:true,default:"None"},
            twitter : {type:String,required:true,default:"None"},
        }
    }],
    location: {type:String,required:true,default:"OAT"},
    duration : {
        start : {type:Date,required:true,default:Date.now},
        end : {type:Date,required:true}
    } ,
    images:{
        profile:{type:String,required:true,default:"/images/vvit_campus_top.jpeg"},
        gallery:[{type:String,required:true,default:"None"}]
    },

})

const Event = mongoose.model("Event",eventSchema);


module.exports = Event