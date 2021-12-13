const mongoose = require('mongoose')
const { Schema } = mongoose;

const Comment = require('./comment')


const blogSchema = new Schema ({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    body:  { type: String, required: true },
    image: { type: String },
    date: { type: Date, default: Date.now},
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog