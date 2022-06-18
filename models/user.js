const { type } = require('jquery');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({

    username : {type: String},
    email : {type:String,unique:true,dropDups: true},
    role : { type: String,required:true},

    active : {type: Boolean,default:false},
    moderator: {type: Boolean,default:false},
    administrator : {type: Boolean,default:false},
    profileupdated:{type:Boolean,default:false},
    regid:{type:String,default:null},
    tokenvalidate:{
        passchangereq:{type:Boolean,default:false},
    },
    profile: {
        updated:{type:Boolean,default:false},
        image:{type:String,default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"},
        willtohelp:{type:Boolean,default:true},
        fullname : { type: String,default:null},
        headline:{type:String,default:"Student at vvit"},
        website: {type:String, default:""},
        github: {type:String, default:""},
        twitter: {type:String, default:""},
        linkedin: {type:String, default:""},
        batch:{type:Number,default:null,length:4},
        course:{type:String,default:null},
    },
    professionaldetails:[{
        title:{type:String,},
        type:{type:String,},
        company:{type:String,},
        location:{type:String},
        startdate:{
            month:{type:String},
            year:{type:Number,length:4}
        },
        current:{type:Boolean,default:false},
        enddate:{
            month:{type:String},
            year:{type:Number,length:4}
        },
    }],
    Educationaldetails:[{
        masterdegree:{type:Boolean,default:false},
        school:{type:String,},
        degree:{type:String,},
        fieldofstudy:{type:String,},
        startdate:{
            month:{type:String},
            year:{type:Number,length:4}
        },
        enddate:{
            month:{type:String},
            year:{type:Number,length:4}
        },
    }],
    personalinfo:{
        updated:{type:Boolean,default:false},
        aboutme:{type:String},
        dob:{type:Date,default:null},
    },
    contactdetails:{
        address:{
            updated:{type:Boolean,default:false},
            city:{type:String,default:null},
            state:{type:String,default:null},
            country:{type:String,default:null},
        },
        phone:{type:Number,length:10},
    },
    otherdetails:{
        certifications:[{
            name:{type:String,},
            organization:{type:String,},
            issuedate:{
                month:{type:String},
                year:{type:String,length:4}
            },
            credentialurl:{type:String}
        }],
        projects:[{
            name:{type:String,},
            start:{
                month:{type:String},
                year:{type:String,length:4}
            },
            end:{
                month:{type:String},
                year:{type:String,length:4}
            },
            url:{type:String},
            description:{type:String},
        }],
        skills:[{
            name:{type:String,},
            level:{type:String}
        }]
    },
    hash:{type:String,default:""},
    salt:{type:String,default:""},

})

userSchema.plugin(passportLocalMongoose,{usernameQueryFields: ["email"]});

const User = mongoose.model('user',userSchema);


module.exports = User;

