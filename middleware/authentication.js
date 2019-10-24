const { jwt } = require("../helpers")
const User = require("../models/user")

function authentication(req, res, next) {
    try {
        const token = req.headers.token
        const decode = jwt.decodeToken(token)
        req.decode = decode
        let _id = req.decode._id
        User.findById(_id)
            .then(user => {
                /* istanbul ignore next */
                if (user) {
                /* istanbul ignore next */
                    next()
                } else {
                    /* istanbul ignore next */
                    next({ statusCode: 401, msg: "You are not authenticated user" })
                    /* istanbul ignore next */
                }
            })
            .catch(next)
    }
    catch{
        next({ statusCode: 401, msg: "You are not authenticated user" })
    }
}

module.exports = authentication