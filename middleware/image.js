'use strict'

const { Storage } = require('@google-cloud/storage')
const CLOUD_BUCKET = process.env.GCLOUD_BUCKET
const path = require('path');
const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: process.env.KEYFILE_PATH
})
const bucket = storage.bucket(CLOUD_BUCKET);

const getPublicUrl = (filename) => {
    return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`
}

const getGsUri = (filename) => {
    return `gs://${CLOUD_BUCKET}/${filename}`
}

const sendUploadToGCS = (req, res, next) => {
    if (!req.file) {
        next()
    } else {
        const gcsname = Date.now() + req.file.originalname
        const file = bucket.file(gcsname)

        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            }
        })

        stream.on('error', (err) => {
            /* istanbul ignore next */
            req.file.cloudStorageError = err
            /* istanbul ignore next */
            next(err)
            /* istanbul ignore next */
        })

        stream.on('finish', () => {
            req.file.cloudStorageObject = gcsname
            file.makePublic().then(() => {
                req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
                req.file.cloudStorageGsUri = getGsUri(gcsname);
                next()
            })
        })

        stream.end(req.file.buffer)
    }
}
const Multer = require('multer'),
    multer = Multer({
        fileFilter: function (req, file, next) {
            /* istanbul ignore next */
            if ((path.extname(file.originalname) === '.jpg' || path.extname(file.originalname) === '.jpeg')) {
            /* istanbul ignore next */
                next(null, true);
            } else {
                /* istanbul ignore next */
                next({ status: 400, message: "Invalid Image Type" });
                /* istanbul ignore next */
            }
            // if ((path.extname(file.originalname) === '.jpg')) {
            //     next(null, true);
            // } else {
            //     next({ status: 400, message: "Invalid Image Type" });
            // }
        },
        storage: Multer.MemoryStorage,
        limits: {
            fileSize: Infinity
        }
    })

module.exports = {
    getPublicUrl,
    sendUploadToGCS,
    multer
}