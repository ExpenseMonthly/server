const Voucer = require('../models/voucer');
const deleteFile = require('../helpers/deleteFileGcs');

class VoucerController {
    static findAll(req, res, next) {
        let where = {};
        if (req.query.title) {
            where = { "title": { $regex: '.*' + req.query.title + '.*' } }
        }
        Voucer.find(where)
            .then(voucers => {
                res.status(200).json(voucers);
            }).catch(next);
    }

    static store(req, res, next) {
        const { title, expire_date, description } = req.body;
        const data = { title, expire_date, description };
        if (req.file) {
            data.image = req.file.cloudStoragePublicUrl;
        }

        Voucer.create(
            data
        ).then(voucer => {
            res.status(201).json(voucer)
        }).catch(next);
    }

    static findOne(req, res, next) {
        Voucer.findOne({
            _id: req.params.id
        }).then(voucer => {
            res.status(200).json(voucer);
        }).catch(next);
    }

    static update(req, res, next) {
        const { title, expire_date, description } = req.body;
        const data = { title, expire_date, description };

        Voucer.findOneAndUpdate({ _id: req.params.id }, data, { omitUndefined: true, runValidators: true })
            .then(data => {
                res.status(200).json({ message: 'successfully updated', data });
            })
            .catch(next);
    }

    static delete(req, res, next) {
        Voucer.findByIdAndDelete(req.params.id)
            .then(data => {
                if (data.image) {
                    let file = data.image.split('/');
                    let fileName = file[file.length - 1];
                    deleteFile(fileName);
                }
                
                res.status(200).json({ message: 'successfully deleted', data });
            })
            .catch(next);
    }
}

module.exports = VoucerController
