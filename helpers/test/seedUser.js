const User = require('../../models/user');

function seedUser (done) {
    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'test') {
    /* istanbul ignore next */
        User.create({
            name: 'user',
            email: 'user@mail.com',
            password: 'password123',
            gender: 'male',
            profile_url: 'tes.jpg',
            point: 0,
            voucers: []
        })
            .then(result => {
                done()
            })
            .catch(done)
    }
};

module.exports = seedUser
