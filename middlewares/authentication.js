const { jwt } = require("../helpers")
const User = require("../models/user")

function authentication(req, res, next) {
    try {
        const token = req.headers.token
        const decode = jwt.decodeToken(token)

        req.decode = decode
        let _id = req.decode.id

        User.findById(_id)
            .then(user => {
                if (user) {
                    next()
                } else {
                    next({ statusCode: 401, msg: "You are not authenticated user" })
                }
            })
            .catch(next)
    }
    catch{
        next({ statusCode: 401, msg: "You are not authenticated user" })
    }
}

module.exports = authentication