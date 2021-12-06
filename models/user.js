const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    fullname : { type: String,required:true},
    username : { type: String,required:true},
    address : { type: String,required:true},
    role : { type: String,required:true},
    phone : { type: Number,required:true},
    active : {type: Boolean,default:false},
    administrator : {type: Boolean,default:false}
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('user',userSchema);


module.exports = User;

