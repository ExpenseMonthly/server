const Voucer = require('../models/voucer');
const deleteFile = require('../helpers/deleteFileGcs');

class VoucerController {
    static findAll(req, res, next) {
        Voucer.find()
            .then(voucers => {
                res.status(200).json(voucers);
            }).catch(next);
    }

    static store(req, res, next) {
        const { title, expire_date, description, point } = req.body;
        const data = { title, expire_date, description, point };
        /* istanbul ignore next */
        if (req.file) {
            data.image = req.file.cloudStoragePublicUrl;
        }
        /* istanbul ignore next */

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
        const { title, expire_date, description, point } = req.body;
        const data = { title, expire_date, description, point };

        Voucer.findOneAndUpdate({ _id: req.params.id }, data, { omitUndefined: true, runValidators: true, new: true })
            .then(data => {
                res.status(200).json({ message: 'successfully updated', data });
            })
            .catch(next);
    }

    static delete(req, res, next) {
        Voucer.findByIdAndDelete(req.params.id)
            .then(data => {
                /* istanbul ignore next */
                if (data.image) {
                    let file = data.image.split('/');
                    let fileName = file[file.length - 1];
                    deleteFile(fileName);
                }
                /* istanbul ignore next */
                
                res.status(200).json({ message: 'successfully deleted', data });
            })
            .catch(next);
    }
}

module.exports = VoucerController
