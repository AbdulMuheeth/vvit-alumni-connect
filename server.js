const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const flash = require('connect-flash')
var fs = require('fs');
var path = require('path')
require('dotenv').config()
const ejs = require("ejs")

const User = require('./models/user')
const Post = require('./models/post')
const Blog = require('./models/blog')
const Event = require('./models/event')

const postRouter = require('./routes/posts')
const blogRouter = require('./routes/blog')
const loginRouter = require('./routes/authentication/login')
const registerRouter = require('./routes/authentication/register')
const logoutRouter = require('./routes/authentication/logout')
const secretRouter = require('./routes/authentication/secrets')
const verifyRouter = require('./routes/authentication/verify')
const profileRouter = require('./routes/authentication/profile')
const profileEditRouter = require('./routes/authentication/profileEdit')
const eventRouter = require('./routes/events')
const galleryRouter = require('./routes/gallery')

const app = express()


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());   

app.use(session({
    secret:"mysecret",
    resave: false,
    saveUninitialized: false
}))


app.use(passport.initialize());     // inititalizing the passport for the authentication
app.use(passport.session()); 

mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected to db')
    }
)

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(flash());
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '/public/bower_components')));

app.use('/posts', postRouter)
app.use('/blog', blogRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/secrets',secretRouter)
app.use('/logout',logoutRouter)
app.use('/verify',verifyRouter);
app.use('/profile',profileRouter);
app.use('/editprofile',profileEditRouter);
app.use('/events',eventRouter)
app.use('/gallery',galleryRouter)


app.get("/", (req, res) => {
    res.redirect("/home")
})


function month(events){
    l = []
    for(var i=0;i<events.length;i++)
        l.push(events[i].duration.start.toLocaleString('default',{month:'short'}));
    return l;
}

function date(events){
    l = []
    for(var i=0;i<events.length;i++)
        l.push(events[i].duration.start.getDate());
    return l;
}

app.get("/home", async (req, res) => {
    let posts = await Post.find()
    let blogPosts = await Blog.find()
    let events = await Event.find().limit(5).sort({$natural:-1})
    let months = await month(events);
    let dates = await date(events)

    res.render('home', { posts: posts, blogPosts: blogPosts,events: events,months:months,dates:dates,loggedIn: req.isAuthenticated()})

})

app.get('*',async(req,res)=>{
    res.status(404).render('404');
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));