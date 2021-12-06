const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
var fs = require('fs');
var path = require('path')
require('dotenv').config()
const ejs = require("ejs")
const User = require('./models/user')

const Post = require('./models/post')
const Blog = require('./models/blog')


const postRouter = require('./routes/posts')
const blogRouter = require('./routes/blog')
const loginRouter = require('./routes/authentication/login');
const registerRouter = require('./routes/authentication/register');
const logoutRouter = require('./routes/authentication/logout');
const secretRouter = require('./routes/authentication/secrets');
const verifyRouter = require('./routes/authentication/verify');
const profileRouter = require('./routes/authentication/profile')

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
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
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

app.get("/", (req, res) => {
    res.redirect("/home")
})

app.get("/home", async (req, res) => {
    let posts = await Post.find()
    let blogPosts = await Blog.find()

    res.render('home', { posts: posts, blogPosts: blogPosts})

})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));