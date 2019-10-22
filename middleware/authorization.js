const Transaction = require('../models/transaction');
const User = require('../models/user')
const Voucer = require('../models/voucer')
function AuthorizationOwner(req, res, next) {
    Transaction.findById(req.params.id)
        .then(data => {
            if (data) {
                if (data.userid == req.decode._id) {
                    next();
                } else {
                    res.status(401).json({ message: 'Unauthorized action! you are not the owner of this Receipt' });
                }
            } else {
                res.status(404).json({ message: `cant find bill with id : ${req.params.id}` });
            }
        })
        .catch(next)
}
async function UserVoucherAuthorization(req, res, next) {
    try {
        const voucerId = req.params.voucerid
        const id = req.decode._id

        const user = await User.findById(id)
        const voucer = await Voucer.findById(voucerId)
        if (user.point < voucer.point) {
            res.status(401).json({ message: 'Point is not enough' });
        } else {
            next()
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { AuthorizationOwner, UserVoucherAuthorization }