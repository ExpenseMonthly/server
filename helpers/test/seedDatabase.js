const User = require('../../models/user');

module.exports = function (done) {
    if (process.env.NODE_ENV === 'test') {
        let user = {
            name: 'administrator',
            email: 'administrator@admin.com',
            password: 'password123',
            gender: 'male',
            profile_url: 'https://storage.googleapis.com/final-project-phase-3/1571371959078index.jpg',
            point: 0
        }
        User.create(user)
            .then(result => {
                done()
            })
            .catch(done)
    }
};

