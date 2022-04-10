const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema ({
    author: { type: String, required: true },
    body:  { type: String, required: true },
    date: { type: Date, default: Date.now},
    commentedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'       
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }
})

commentSchema.pre('remove', function(next) {
    this.model('Post').updateMany(
        { },
        { "$pull": { "comments": this._id } },
        { "multi": true },
        next
    );
})

commentSchema.pre('remove', function(next) {
    this.model('Blog').updateMany(
        { },
        { "$pull": { "comments": this._id } },
        { "multi": true },
        next
    );
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment