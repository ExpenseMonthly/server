const Transaction = require('../models/transaction');

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

module.exports = { AuthorizationOwner }