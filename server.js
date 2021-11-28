const express = require("express")
const ejs = require("ejs")
const app = express()

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("home", {name: "Muheet"})
})

app.listen(3000, () => {
    console.log("Server is up & running on port: 3000")
})