const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
var fs = require('fs');
var path = require('path')
require('dotenv').config()
const ejs = require("ejs")


const postRouter = require('./routes/posts')

const app = express()

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/posts', postRouter)

mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected to db')
    }
)


app.get("/", (req, res) => {
    res.redirect("/home")
})

app.get("/home", (req, res) => {
    res.render("home")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));