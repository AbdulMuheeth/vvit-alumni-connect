const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    tag:{type:String,default:"this is the tagline of the event"},
    guests:[{
        guestname : {type:String},
        guestimage : {type:String},
        guestfield:{type:String},
        profile: {
            facebook:{type:String,default:"None"},
            instagram : {type:String,default:"None"},
            twitter : {type:String,default:"None"},
        }
    }],
    location: {type:String,required:true,default:"OAT"},
    duration : {
        start : {type:Date,required:true},
        end : {type:Date,required:true}
    } ,
    images:{
        profile:{type:String,default:"/images/vvit_campus_top.jpeg"},
        gallery:[{type:String}]
    },

})

const Event = mongoose.model("Event",eventSchema);


module.exports = Event