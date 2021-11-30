const express = require('express')
const multer = require('multer')
const upload = require("./../upload")
const path = require('path')
const fs = require('fs')
const router = express.Router()

const Post = require('../models/post')



// ------------------CREATE POST ---------------

router.get("/new", (req, res) => {
    res.render('./../views/posts/newPost')
})

router.post("/new", upload.single('postImage'), (req, res) => {

    let filename = ''
    if(req.file && req.file.filename !== '') {
        filename = req.file.filename
    }

    const newPost = new Post({
        title: req.body.postTitle,
        author: req.body.authorName,
        body: req.body.postContent,
        image: filename
    })

    newPost.save()

    res.redirect("/posts/" + newPost.id)
})


// ------------------ ALL POSTS -----------------

router.get("/", (req, res) => {
    Post.find({}, (err, foundPosts) => {
        res.render('./../views/posts/posts', { posts: foundPosts})
    })
})


// -------------------- SINGLE POST --------------

router.get("/:id", (req, res) => {

    const postId = req.params.id

    Post.findById(postId, (err, post) => {
        res.render("./../views/posts/post", {post: post})
    })
})

router.delete('/:id', async (req, res) => {
    const postId = req.params.id

    const post = await Post.findById(req.params.id)
    deleteImage(post.image)

    await Post.findByIdAndDelete(postId)
    res.redirect('/posts')
})

router.get('/edit/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('posts/edit', { post: post })
})

router.put('/:id', upload.single('editImage'), async (req, res) => {

    const post = await Post.findById(req.params.id)
    let filename = post.image
    if(req.file && req.file.filename !== '') {
        deleteImage(filename)
        filename = req.file.filename
    }

    Post.findByIdAndUpdate(
        req.params.id,
        {
            author:req.body.authorName,
            title: req.body.postTitle,
            body: req.body.postContent,
            image: filename 
        }, 
        {upsert: true},
        function(err){
            if(err)
                console.log(err)
        }
    )

    res.redirect(`/posts/${req.params.id}`)
})


function deleteImage(imgUrl) {
    fs.unlink(path.join("uploads/", imgUrl), (err) => {
        if(err) {
            throw err
        }
    })
}


module.exports = router;