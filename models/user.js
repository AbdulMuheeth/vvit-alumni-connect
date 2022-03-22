const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    fullname : { type: String,required:true},
    username : { type: String,required:true},
    profilename : { type: String,required:true,unique:true,dropDups: true},
    address : { type: String,required:true},
    role : { type: String,required:true},
    phone : { type: Number,required:true},
    active : {type: Boolean,default:false},
    moderator: {type: Boolean,default:false},
    willtohelp:{type:Boolean,default:true},
    occupation: {type:String, default:"Edit your occupation"},
    aboutyourself:{type:String,default:"None"},
    socialmedia: {
        website: {type:String, default:"None"},
        github: {type:String, default:"None"},
        twitter: {type:String, default:"None"},
        linkedin: {type:String, default:"None"}
    },
    administrator : {type: Boolean,default:false}
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('user',userSchema);


module.exports = User;

