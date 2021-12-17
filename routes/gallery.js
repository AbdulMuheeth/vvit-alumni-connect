const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = require("./../upload")
const path = require('path')
const fs = require('fs')

const Image = require('../models/image')

router.get('/', async (req, res) => {
    const images = await Image.find();
    res.render("./../views/gallery/home", { images: images})
})

// ----------- UPLOAD NEW IMAGE ---------

router.get('/new', (req, res) => {
    res.render("./../views/gallery/new")
})

router.post('/new', upload.single('image'), (req, res) => {
    let filename = ''
    if(req.file && req.file.filename !== '') {
        filename = req.file.filename
    } else {
        res.redirect("/gallery/new")
    }

    const newImage = new Image({
        image: filename
    })

    newImage.save()
    res.redirect("/gallery")
})

function deleteImage(imgUrl) {
    fs.unlink(path.join("uploads/", imgUrl), (err) => {
        if(err) {
            throw err
        }
    })
}

module.exports = router;