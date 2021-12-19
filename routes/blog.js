const express = require('express')
const router = express.Router()

const Blog = require('../models/blog')
const Comment = require('../models/comment')

// ------------------ ALL BLOG POSTS -----------------

router.get("/", (req, res) => {
    Blog.find({}, (err, foundPosts) => {
        res.render('./../views/blog/blogPosts', { posts: foundPosts, loggedIn: req.isAuthenticated() })
    })
})

// ----------------- CRUD OPERATIONS ON BLOG POST ------

// CREATE BLOG POST 

router.get("/new", (req, res) => {
    res.render('./../views/blog/newBlogPost',{ loggedIn: req.isAuthenticated() })
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

    Blog.findById(postId).populate('comments').exec((err, post) => {
        res.render("./../views/blog/blogPost", {post: post, loggedIn: req.isAuthenticated() })
    })
})

// UPDATE OR EDIT A BLOG POST

router.get('/edit/:id', async (req, res) => {
    const post = await Blog.findById(req.params.id)
    res.render('Blog/edit', { post: post, loggedIn: req.isAuthenticated()  })
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


// ------- COMMENTS TO BLOG 

// ---- ADD A NEW COMMENT
router.post('/:id/comment', async (req, res) => {

    const comment = await new Comment({
        author: req.body.name,
        body: req.body.body
    })

    await comment.save(async (err, result) => {
        if(err) {
            console.log(err)
        } else {
            Blog.findById(req.params.id, async (err, post) => {
                if(err) { console.log(err) }
                else {
                    await post.comments.push(result)
                    await post.save()
                }
            })
        }
    })

    res.redirect(`/blog/${req.params.id}`)
}) 

// ---- UPDATE A COMMENT

router.get('/:postId/edit/comments/:commentId', async (req, res) => {
    const comment = await Comment.findById(req.params.commentId)

    Blog.findById(req.params.postId).populate('comments').exec((err, post) => {     
        res.render("./../views/blog/comments/editComment", {post: post, editComment: comment, loggedIn: req.isAuthenticated() })
    })
})

router.put('/:postId/comments/:commentId', async (req, res) => {

    await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
            author:req.body.name,
            body: req.body.body,
        }
    )

    res.redirect(`/blog/${req.params.postId}`)
})

// DELETE A COMMENT
router.delete('/:postId/comments/:commentId', async (req, res) => {
    const commentId = req.params.commentId
    const postId = req.params.postId

    const comment = await Comment.findById(commentId)
    await comment.delete()

    res.redirect(`/blog/${postId}`)
})
