const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username : {type:String , required:true},
    password : { type : String, requried : true},
    administrator : {type: Boolean, default:false},
    active : {type: Boolean, default:false}
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('user',userSchema);


module.exports = User;

