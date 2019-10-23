const bcrypt = require('bcryptjs');

const getSalt = bcrypt.genSaltSync(10);
/* istanbul ignore next */
function generateHash(password = '') {
    return bcrypt.hashSync(password, getSalt);
}
/* istanbul ignore next */
function compare(password = '', hash = '') {
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    generateHash,
    compare
}