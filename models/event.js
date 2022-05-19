const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String},
    tag:{type:String,default:"this is the tagline of the event"},
    guests:[{
        guestname : {type:String},
        guestimage : {type:String,default:'https://cdn.icon-icons.com/icons2/2468/PNG/512/user_kids_avatar_user_profile_icon_149314.png'},
        guestfield:{type:String},
        profile: {
            facebook:{type:String,default:"None"},
            instagram : {type:String,default:"None"},
            twitter : {type:String,default:"None"},
        }
    }],
    location: {type:String,required:true,default:"OAT"},
    status:{ type:String,required:true,default:"upcoming" },
    duration : {
        start : {type:Date,required:true},
        end : {type:Date,required:true}
    },
    images:{
        profile:{type:String,default:"/images/vvit_campus_top.jpeg"},
        gallery:[{type:String}]
    },

})

const Event = mongoose.model("Event",eventSchema);


module.exports = Event