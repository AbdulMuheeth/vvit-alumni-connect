const express = require('express')
const router = express.Router()

const Blog = require('../models/blog')

// ------------------ ALL BLOG POSTS -----------------

router.get("/", (req, res) => {
    Blog.find({}, (err, foundPosts) => {
        res.render('./../views/blog/Blogposts', { posts: foundPosts})
    })
})

// ----------------- CRUD OPERATIONS ON BLOG POST ------

// CREATE BLOG POST 

router.get("/new", (req, res) => {
    res.render('./../views/blog/newBlogPost')
})

router.post("/new", async (req, res) => {

    console.log(req.body)

    const newPost = new Blog({
        title: req.body.blogPostTitle,
        author: req.body.authorName,
        description: req.body.blogPostDesc,
        body: req.body.blogPostContent,
        image: req.body.blogImage
    })

    await newPost.save()

    res.redirect("/blog/" + newPost.id)
})

// READ BLOG POST

router.get("/:id", (req, res) => {

    const postId = req.params.id

    Blog.findById(postId, (err, post) => {
        res.render("./../views/blog/blogPost", {post: post})
    })
})

// UPDATE OR EDIT A BLOG POST

router.get('/edit/:id', async (req, res) => {
    const post = await Blog.findById(req.params.id)
    res.render('Blog/edit', { post: post })
})

router.put('/:id', async (req, res) => {

    await Blog.findByIdAndUpdate(
        req.params.id,
        {
            author: req.body.authorName,
            title: req.body.blogPostTitle,
            description: req.body.blogPostDesc,
            body: req.body.blogPostContent,
            image: req.body.blogImage
        }
    )
    
    res.redirect(`/blog/${req.params.id}`)
})


// DELETE A BLOG POST

router.delete('/:id', async (req, res) => {
    const postId = req.params.id

    await Blog.findByIdAndDelete(postId)
    res.redirect('/blog')
})

module.exports = router;