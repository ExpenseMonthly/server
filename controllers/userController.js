const User = require('../models/user');
const { jwt } = require('../helpers');
const { bcrypt } = require('../helpers');

class UserController {
    static register(req, res, next) {
        const { name, email, password, gender, point } = req.body
        const data = { name, email, password, gender, point };

        if (req.file) {
            data.profile_url = req.file.cloudStoragePublicUrl;
        }

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