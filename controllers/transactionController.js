const Transaction = require('../models/transaction');
const User = require('../models/user');
const deleteFile = require('../helpers/deleteFileGcs');

class TransactionController {

    static findAll(req, res, next) {
        const userid = req.decode._id;
        let where = { userid };
        if (req.query.receipt_id) {
            where = { "receipt_id": { $regex: '.*' + req.query.receipt_id + '.*' } }
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
        items = JSON.parse(items);
        let data = { receipt_id, date, items, userid, image_url };

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
                .then(user => {
                    newBill.items.forEach(item => {
                        newBill.totalPrice += Number(item.qty) * Number(item.price);
                    });
                    // console.log(newBill);
                    // console.log(newBill.totalPrice);
                    res.status(201).json({ total: newBill.totalPrice, ...newBill._doc });
                })
                .catch(next);


        })
    }

    static findOne(req, res, next) {
        Transaction.findOne({
            _id: req.params.id
        }).then(data => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json({ message: `cant find bill with id : ${req.params.id}` });
            }
        }).catch(next);
    }

    static update(req, res, next) {
        let data = {};
        req.body.receipt_id && (data.receipt_id = req.body.receipt_id);
        req.body.date && (data.date = req.body.date);
        req.body.items && (data.items = req.body.items);
        if (req.file) {
            data.image_url = req.file.cloudStoragePublicUrl;
        }
        Transaction.findById(req.params.id)
            .then(receipt => {
                if (receipt) {
                    let file = receipt.image_url.split('/');
                    let fileName = file[file.length - 1];
                    deleteFile(fileName);
                    return Transaction.findOneAndUpdate({
                        _id: req.params.id
                    }, data, {
                        omitUndefined: true, runValidators: true, new: true
                    })
                } else {
                    res.status(404).json({ message: `cant find bill with id : ${req.params.id}` });
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
                if (data) {
                    receipt = data;
                    let file = data.image_url.split('/');
                    let fileName = file[file.length - 1];
                    deleteFile(fileName);
                    return User.findById(req.decode._id)
                } else {
                    res.status(404).json({ message: `cant find bill with id : ${req.params.id}` });
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
