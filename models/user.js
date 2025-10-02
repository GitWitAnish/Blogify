const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    salt:{
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/avatar.png'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});


const User = model('User', userSchema);
module.exports = User;