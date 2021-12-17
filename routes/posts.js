const express = require('express')
const router = express.Router()

const Post = require('../models/post')
const Comment = require('../models/comment')

// ------------------CREATE POST ---------------

router.get("/new", (req, res) => {
    res.render('./../views/posts/newPost')
})

router.post("/new", async (req, res) => {

    const newPost = new Post({
        title: req.body.postTitle,
        author: req.body.authorName,
        body: req.body.postContent,
        image: req.body.PostImage 
    })

    await newPost.save()
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
   
    Post.findById(postId).populate('comments').exec((err, post) => {
        res.render("./../views/posts/post", {post: post})
    })
})

// DELETE A POST

router.delete('/:id', async (req, res) => {
    const postId = req.params.id
    const post = await Post.findById(postId)

    await Comment.deleteMany({
        "_id": {
            $in: post.comments
        }
    })

    await Post.findByIdAndDelete(postId)
    res.redirect('/posts')
})

// EDIT OR UPDATE A POST

router.get('/edit/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('posts/edit', { post: post })
})

router.put('/:id', async (req, res) => {
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

    res.redirect(`/posts/${req.params.id}`)
})

// ------- COMMENTS TO POSTS

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

    
}) 

// ---- UPDATE A COMMENT

router.get('/:postId/edit/comments/:commentId', async (req, res) => {
    const comment = await Comment.findById(req.params.commentId)

    Post.findById(req.params.postId).populate('comments').exec((err, post) => {     
        res.render("./../views/posts/comments/editComment", {post: post, editComment: comment})
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

    res.redirect(`/posts/${req.params.postId}`)
})

// DELETE A COMMENT
router.delete('/:postId/comments/:commentId', async (req, res) => {
    const commentId = req.params.commentId
    const postId = req.params.postId

    const comment = await Comment.findById(commentId)
    await comment.delete()

    res.redirect(`/posts/${postId}`)
})


module.exports = router