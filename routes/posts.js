const express = require('express')
const router = express.Router()

const Post = require('../models/post')
const Comment = require('../models/comment')

// ------------------CREATE POST ---------------

router.get("/new", (req, res) => {
    res.render('./../views/posts/newPost',{ loggedIn: req.isAuthenticated() })
})

router.post("/new", async (req, res) => {

    if(req.isAuthenticated()) {
        const newPost = new Post({
            title: req.body.postTitle,
            author: req.user.username,
            body: req.body.postContent,
            image: req.body.PostImage,
            postedBy: req.user.id
        })
    
        await newPost.save()
        res.redirect("/posts/" + newPost.id)
    } else {
        res.redirect("/login")
    }
})

// ------------------ ALL POSTS -----------------

router.get("/", (req, res) => {
    Post.find({}, (err, foundPosts) => {
        res.render('./../views/posts/posts', { user: req.user, posts: foundPosts, loggedIn: req.isAuthenticated() })
    })
})


// -------------------- SINGLE POST --------------

// READ A POST

router.get("/:id", (req, res) => {
    const postId = req.params.id
   
    Post.findById(postId).populate('comments').exec((err, post) => {
        const myPost = (req.user && post.postedBy.equals(req.user.id))
        res.render("./../views/posts/post", { user: req.user, postedByMe: myPost, post: post, loggedIn: req.isAuthenticated() })
    })
})

// DELETE A POST

router.delete('/:id', async (req, res) => {

    if(req.isAuthenticated()) { 
        const postId = req.params.id
        const post = await Post.findById(postId)

        if(post.postedBy.equals(req.user.id)) {

            await Comment.deleteMany({
                "_id": {
                    $in: post.comments
                }
            })
    
            await Post.findByIdAndDelete(postId)

        }

        res.redirect('/posts')
    } else {
        res.redirect('/login')
    }
})

// EDIT OR UPDATE A POST

router.get('/edit/:id', async (req, res) => {
    if(req.isAuthenticated) {
        const post = await Post.findById(req.params.id)
        if(post.postedBy.equals(req.user.id)) {
            res.render('posts/edit', { post: post , loggedIn: req.isAuthenticated() })
        } else {
            res.redirect('/posts')
        }
    } else {
        res.redirect('/login')
    }
})

router.put('/:id', async (req, res) => {
    if(req.isAuthenticated()) {
        const post = await Post.findById(req.params.id)
        if(post.postedBy.equals(req.user.id)) {
            await Post.findByIdAndUpdate(
                req.params.id,
                {
                    title: req.body.postTitle,
                    body: req.body.postContent,
                    image: req.body.PostImage 
                }
            )
        }  
        res.redirect(`/posts/${req.params.id}`)
    } else {
        res.redirect('/login')
    }
})

// ------- COMMENTS TO POSTS

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
                Post.findById(req.params.id, async (err, post) => {
                    if(err) { console.log(err) }
                    else {
                        await post.comments.push(result)
                        await post.save()
                        res.redirect(`/posts/${req.params.id}`)
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
            Post.findById(req.params.postId).populate('comments').exec((err, post) => {   
                const myPost = (req.user && post.postedBy.equals(req.user.id))  
                res.render("./../views/posts/comments/editComment", {user: req.user, postedByMe: myPost, post: post, editComment: comment, loggedIn: req.isAuthenticated() })
            })
        } else {
            res.redirect(`/posts/${req.params.postId}`)
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
        res.redirect(`/posts/${req.params.postId}`)
    } else {
        res.redirect('/login')
    }
})

// DELETE A COMMENT
router.delete('/:postId/comments/:commentId', async (req, res) => {
    if(req.isAuthenticated()) {
        const comment = await Comment.findById(req.params.commentId)

        if(comment.commentedBy.equals(req.user.id)) {
            const commentId = req.params.commentId
            const postId = req.params.postId

            const comment = await Comment.findById(commentId)
            await comment.delete()
        }
        
        res.redirect(`/posts/${req.params.postId}`)
    } else {
        res.redirect('/login')
    }
})


module.exports = router