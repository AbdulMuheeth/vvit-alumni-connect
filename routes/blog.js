const express = require('express')
const router = express.Router()

const Blog = require('../models/blog')
const Comment = require('../models/comment')

// ------------------ ALL BLOG POSTS -----------------

router.get("/pages/:page", async (req, res) => {
    const perPage = 3
    const page = req.params.page || 1
    let totalPosts = await Blog.find({}).count();

    Blog.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, foundPosts) => {
            console.log(totalPosts, Math.ceil(totalPosts / perPage))
            res.render('./../views/blog/blogPosts', { 
                user: req.user, 
                posts: foundPosts, 
                loggedIn: req.isAuthenticated(),
                current: page,
                pages: Math.ceil(totalPosts / perPage) 
            })
        })
})

// ----------------- CRUD OPERATIONS ON BLOG POST ------

// CREATE BLOG POST 

router.get("/new", (req, res) => {
    if(req.isAuthenticated())
        res.render('./../views/blog/newBlogPost', {loggedIn: req.isAuthenticated()})
    else
        res.redirect('/login')
})

router.post("/new", async (req, res) => {

    if(req.isAuthenticated()) {
        const newPost = new Blog({
            title: req.body.blogPostTitle,
            author: req.user.username,
            description: req.body.blogPostDesc,
            body: req.body.blogPostContent,
            image: req.body.blogImage,
            postedBy: req.user.id
        })
    
        await newPost.save()
    
        res.redirect("/blog/" + newPost.id)
    }
    else {
        res.redirect('/login')
    }
})

// READ BLOG POST

router.get("/:id", (req, res) => {

    const postId = req.params.id

    Blog.findById(postId).populate('comments').exec((err, post) => {
        res.render("./../views/blog/blogPost", {post: post, user: req.user, loggedIn: req.isAuthenticated() })
    })
})

// UPDATE OR EDIT A BLOG POST

router.get('/edit/:id', async (req, res) => {
    const post = await Blog.findById(req.params.id)
    if(req.isAuthenticated() ) {
        if(post.postedBy.equals(req.user.id)) {
            res.render('Blog/edit', { post: post, user: req.user, loggedIn: req.isAuthenticated()  })
        } else {
            res.redirect('/blog/' + req.params.id)
        }
    } else {
        res.redirect('/login')
    }
})

router.put('/:id', async (req, res) => {

    const post = await Blog.findById(req.params.id)
    if(req.isAuthenticated() ) {
        if(post.postedBy.equals(req.user.id)) {

            await Blog.findByIdAndUpdate(
                req.params.id,
                {
                    author: req.user.username,
                    title: req.body.blogPostTitle,
                    description: req.body.blogPostDesc,
                    body: req.body.blogPostContent,
                    image: req.body.blogImage
                }
            )
            
            res.redirect(`/blog/${req.params.id}`)
        } else {
            res.redirect('/blog/' + req.params.id)
        }
    } else {
        res.redirect('/login')
    }
})


// DELETE A BLOG POST

router.delete('/:id', async (req, res) => {
    const postId = req.params.id
    const post = await Blog.findById(req.params.id)
    if(req.isAuthenticated() ) {
        if(post.postedBy.equals(req.user.id)) {
            await Blog.findByIdAndDelete(postId)
        }

        res.redirect('/blog')
    } else {
        res.redirect('/login')
    }
})


// ------- COMMENTS TO BLOG 

// ---- ADD A NEW COMMENT
router.post('/:id/comment', async (req, res) => {
    if(req.isAuthenticated()) {
        const comment = await new Comment({
            author: req.user.username,
            commentedBy: req.user.id,
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
                        res.redirect(`/blog/${req.params.id}`)
                    }
                })
            }
        })
    } else {
        res.redirect('/login')
    }
}) 

// ---- UPDATE A COMMENT

router.get('/:postId/edit/comments/:commentId', async (req, res) => {
    if(req.isAuthenticated()) {
        const comment = await Comment.findById(req.params.commentId)

        if(comment.commentedBy.equals(req.user.id)) {
            Blog.findById(req.params.postId).populate('comments').exec((err, post) => {   
                const myPost = (req.user && post.postedBy.equals(req.user.id))  
                res.render("./../views/blog/comments/editComment", {user: req.user, postedByMe: myPost, post: post, editComment: comment, loggedIn: req.isAuthenticated() })
            })
        } else {
            res.redirect(`/blog/${req.params.postId}`)
        }
    } else {
        res.redirect('/login')
    }
})

router.put('/:postId/comments/:commentId', async (req, res) => {

    if(req.isAuthenticated()) {
        const comment = await Comment.findById(req.params.commentId)

        if(comment.commentedBy.equals(req.user.id)) {
            await Comment.findByIdAndUpdate(
                req.params.commentId,
                {
                    body: req.body.body,
                }
            )
        }
        res.redirect(`/blog/${req.params.postId}`)
    } else {
        res.redirect('/login')
    }
})

// DELETE A COMMENT
router.delete('/:postId/comments/:commentId', async (req, res) => {
    if(req.isAuthenticated()) {
        const comment = await Comment.findById(req.params.commentId)

        if(comment.commentedBy.equals(req.user.id)) {
            await comment.delete()
        }
        
        res.redirect(`/blog/${req.params.postId}`)
    } else {
        res.redirect('/login')
    }
})

module.exports = router;