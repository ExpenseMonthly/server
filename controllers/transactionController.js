const Transaction = require('../models/transaction');
const User = require('../models/user');
const deleteFile = require('../helpers/deleteFileGcs');

class TransactionController {

    static findAll(req, res, next) {
        const userid = req.decode._id;
        let where = { userid };
        /* istanbul ignore next */
        if (req.query.receipt_id) {
            /* istanbul ignore next */
            where = { "receipt_id": { $regex: '.*' + req.query.receipt_id + '.*' } }
            /* istanbul ignore next */
        }
        Transaction.find(where, null, { sort: { createdAt: -1 } })
            .then(transactions => {
                res.status(200).json(transactions);
            }).catch(next);
    }

    static store(req, res, next) {
        let newBill = {};
        const userid = req.decode._id;
        let { receipt_id, date, items, image_url } = req.body;
        let data = { receipt_id, date, items, userid, image_url };

        items.map(item => {
            item.qty = Number(item.qty);
            item.price = Number(item.price);
        });

        Transaction.create(
            data
        ).then(transaction => {
            newBill = transaction
            newBill.totalPrice = 0;
            return User.findById(req.decode._id)
        }).then(receipt => {
            let point = receipt.point + 1;
            return User.findOneAndUpdate({
                _id: req.decode._id
            }, {
                point
            }, {
                new: true
            })
        })
            .then(user => {
                newBill.items.forEach(item => {
                    newBill.totalPrice += Number(item.qty) * Number(item.price);
                });
                // console.log(newBill);
                // console.log(newBill.totalPrice);
                res.status(201).json({ total: newBill.totalPrice, ...newBill._doc });
            })
            .catch(next);
    }

    static findOne(req, res, next) {
        Transaction.findOne({
            _id: req.params.id
        }).then(data => {
            /* istanbul ignore next */
            if (data) {
            /* istanbul ignore next */
                res.status(200).json(data)
            } else {
                /* istanbul ignore next */
                res.status(404).json({ message: `cant find bill with id : ${req.params.id}` });
                /* istanbul ignore next */
            }
        }).catch(next);
    }

    static update(req, res, next) {
        let data = {};
        /* istanbul ignore next */
        req.body.receipt_id && (data.receipt_id = req.body.receipt_id);
        /* istanbul ignore next */
        req.body.date && (data.date = req.body.date);
        /* istanbul ignore next */
        req.body.items && (data.items = req.body.items);
        /* istanbul ignore next */
        Transaction.findById(req.params.id)
            .then(receipt => {
                /* istanbul ignore next */
                if (receipt) {
                /* istanbul ignore next */
                    return Transaction.findOneAndUpdate({
                        _id: req.params.id
                    }, data, {
                        omitUndefined: true, runValidators: true, new: true
                    })
                } else {
                    /* istanbul ignore next */
                    res.status(404).json({ message: `cant find bill with id : ${req.params.id}` });
                    /* istanbul ignore next */
                }
            })
            .then(receipt => {
                res.status(200).json({ message: 'successfully updated', receipt });
            })
            .catch(next);
    }

    static delete(req, res, next) {
        let receipt = {};
        Transaction.findByIdAndDelete(req.params.id)
            .then(data => {
                /* istanbul ignore next */
                if (data) {
                /* istanbul ignore next */
                    receipt = data;
                    /* istanbul ignore next */
                    if (data.image_url) {
                        /* istanbul ignore next */
                        let file = data.image_url.split('/');
                        /* istanbul ignore next */
                        let fileName = file[file.length - 1];
                        /* istanbul ignore next */
                        deleteFile(fileName);
                        /* istanbul ignore next */
                    }
                    return User.findById(req.decode._id)
                } else {
                    /* istanbul ignore next */
                    res.status(404).json({ message: `cant find bill with id : ${req.params.id}` });
                    /* istanbul ignore next */
                }
            })
            .then(user => {
                const point = user.point - 1;
                return User.findOneAndUpdate(
                    {
                        _id: req.decode._id
                    },
                    {
                        point
                    },
                    {
                        new: true
                    })
            })
            .then(user => {
                res.status(200).json({ message: 'successfully deleted', receipt });
            })
            .catch(next);
    }

    static findRangeDate(req, res, next) {
        const userid = req.decode._id;
        let { startDate, endDate } = req.params;
        let where = { "date": { '$gte': new Date(startDate), '$lte': new Date(endDate) }, userid }
        const result = []
        Transaction.find(where, null, { sort: { createdAt: -1 } })
            .then(transactions => {
                transactions.forEach(({ items, _id, date, userid, createdAt, updatedAt }) => {
                    let total = 0
                    items.forEach(item => {
                        total += item.price
                    })
                    result.push({
                        items, _id, date, userid, createdAt, updatedAt, total
                    })
                })

                res.status(200).json(result);
            }).catch(next);
    }
}

module.exports = TransactionController
