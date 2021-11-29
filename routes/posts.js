const express = require('express')
const router = express.Router()

const Post = require('../models/post')

// ------------------CREATE POST ---------------

router.get("/new", (req, res) => {
    res.render('./../views/posts/newPost')
})

router.post("/new", (req, res) => {
    const newPost = new Post({
        title: req.body.postTitle,
        author: req.body.authorName,
        body: req.body.postContent
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

    await Post.findByIdAndDelete(postId)
    res.redirect('/posts')
})

router.get('/edit/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('posts/edit', { post: post })
})

router.put('/:id', async (req, res) => {
    const postId = req.params.id

    Post.findByIdAndUpdate(
        postId,
        {
            author:req.body.authorName,
            title: req.body.postTitle,
            body: req.body.postContent
        }, 
        {upsert: true},
        function(err){
            if(err)
                console.log(err)
        }
    )

    res.redirect(`/posts/${postId}`)
})



module.exports = router;