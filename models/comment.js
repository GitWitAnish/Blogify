const {Schema, model} = require('mongoose');

const commentSchema = new Schema({
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
