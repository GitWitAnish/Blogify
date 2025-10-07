const JWT = require('jsonwebtoken');

const SECRET = 'anish69';

function createToken(user){
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };

    const token = JWT.sign(payload, SECRET);
    return token;
}

function verifyToken(token){
    try {
        return JWT.verify(token, SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = {
    createToken,
    verifyToken
};