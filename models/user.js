const { createHmac, randomBytes } = require('node:crypto');
const {Schema, model} = require('mongoose');
const { createToken } = require('../services/authentication');

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
        type: String
    },

    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/avatar.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')) return next();

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt)
          .update(user.password)
          .digest('hex');

          this.salt = salt;
          this.password = hashedPassword;
          
          next();
});

userSchema.static('matchPasswordAndCreateToken', async function(email, password){
    const user = await this.findOne({email});

    if(!user) throw new Error('User not found');

    const hashedPassword = createHmac('sha256', user.salt)
          .update(password)
          .digest('hex');

    if(user.password === hashedPassword) {  
        const token = createToken(user);
        return token;

}
    else
        throw new Error('Invalid password');
});

const User = model('User', userSchema);
module.exports = User;