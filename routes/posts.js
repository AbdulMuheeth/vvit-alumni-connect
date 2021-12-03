const express = require('express')
const router = express.Router()

const Post = require('../models/post')

// ------------------CREATE POST ---------------

router.get("/new", (req, res) => {
    res.render('./../views/posts/newPost')
})

router.post("/new", (req, res) => {

    console.log(req.body, req)

    const newPost = new Post({
        title: req.body.postTitle,
        author: req.body.authorName,
        body: req.body.postContent,
        image: req.body.PostImage 
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

// READ A POST

router.get("/:id", (req, res) => {
    const postId = req.params.id
   
    Post.findById(postId, (err, post) => {
        res.render("./../views/posts/post", {post: post})
    })
})

// DELETE A POST

router.delete('/:id', async (req, res) => {
    const postId = req.params.id

    await Post.findByIdAndDelete(postId)
    res.redirect('/posts')
})

// EDIT OR UPDATE A POST

router.get('/edit/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('posts/edit', { post: post })
})

router.put('/:id', async (req, res) => {
    console.log(req.body)
    await Post.findByIdAndUpdate(
        req.params.id,
        {
            author:req.body.authorName,
            title: req.body.postTitle,
            body: req.body.postContent,
            image: req.body.PostImage 
        }
    )

    const post = await Post.findById(req.params.id)
    console.log(post)

    res.redirect(`/posts/${req.params.id}`)
})



module.exports = router;