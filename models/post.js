const mongoose = require('mongoose')
const { Schema } = mongoose

const Comment = require('./comment')


const postSchema = new Schema ({
    title: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String },
    body:  { type: String, required: true },
    date: { type: Date, default: Date.now},
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post