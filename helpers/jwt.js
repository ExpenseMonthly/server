const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET

function generateToken(payload) {
    return jwt.sign(payload, secret);
}

function decodeToken(token) {
    return jwt.verify(token, secret);
}

module.exports = {
    generateToken,
    decodeToken
}