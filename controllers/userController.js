const User = require('../models/user');
const { jwt } = require('../helpers');
const { bcrypt } = require('../helpers');

class UserController {

    static update(req, res, next) {
        const _id = req.decode._id;
        User.findById({
            _id
        })
            .then(user => {
                if (user) {
                    const point = user.point + Number(req.body.point);
                    return User.findOneAndUpdate({
                        _id
                    }, {
                        point
                    }, {
                        new: true
                    })
                } else {
                    next({ status: 404, message: `User not exist` });
                }
            })
            .then(user => {
                res.status(200).json({ message: `User point has been updated`, user });
            })
            .catch(next);
    }

    static getUser(req, res, next) {
        const _id = req.decode._id;
        User.findById({ _id })
            .then(user => {
                user = {
                    _id: user._id,
                    gender: user.gender,
                    email: user.email,
                    point: user.point,
                    name: user.name
                }
                res.status(200).json(user);
            })
            .catch(next);
    }

    static getProfile(req, res, next) {
        const _id = req.decode._id;
        User.findById({ _id })
            .then(user => {
                res.status(200).json(user);
            })
            .catch(next);
    }

    static register(req, res, next) {
        const { name, email, password, gender, point } = req.body
        const data = { name, email, password, gender, point };
        
        /* istanbul ignore next */
        if (req.file) {
            data.profile_url = req.file.cloudStoragePublicUrl;
        }
        /* istanbul ignore next */

        User.create(data)
            .then(result => {
                res.status(201).json(result)
            })
            .catch(next)
    }

    static login(req, res, next) {
        const { email, password } = req.body;
        let errors = [];
        if (email === undefined || email === '') {
            errors.push('email is required');
        }

        if (password === undefined || password === '') {
            errors.push('password is required');
        }

        if (errors.length > 0) {
            return next({ statusCode: 400, msg: errors });
        }

        User.findOne({ email })
            .then(user => {
                if (!user) {
                    next({ statusCode: 400, msg: "email/password not found" });
                } else {

                    if (bcrypt.compare(password, user.password)) {
                        let userData = {
                            '_id': user._id,
                            'name': user.name,
                            'email': user.email,
                            'gender': user.gender,
                            'profile_url': user.profile_url,
                            'point': user.point
                        }

                        let token = jwt.generateToken(userData);
                        res.status(200).json({ token, "user": userData })
                    } else {
                        next({ statusCode: 400, msg: "email/password not found" });
                    }
                }
            })
            .catch(next)
    }
}

module.exports = UserController