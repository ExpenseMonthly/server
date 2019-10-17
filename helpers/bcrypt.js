const bcrypt = require('bcryptjs');

const getSalt = bcrypt.genSaltSync(10);

function generateHash(password = '') {
    return bcrypt.hashSync(password, getSalt);
}

function compare(password = '', hash = '') {
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    generateHash,
    compare
}