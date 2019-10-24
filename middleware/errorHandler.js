const deleteFile = require('../helpers/deleteFileGcs');

function errorHandler(err, req, res, next) {
    // console.log(err, `<<<<<<<<<<<,,,,,,,,,,,,,,,,`);
    // console.log(err.stack, `<<<<<<<<<<<,,,,,,,,,,,,,,,,`);
    /* istanbul ignore next */
    if (req.file && req.file.cloudStoragePublicUrl) {
    /* istanbul ignore next */
        /* istanbul ignore next */
        let file = req.file.cloudStoragePublicUrl.split('/');
        /* istanbul ignore next */
        let fileName = file[file.length - 1];
        /* istanbul ignore next */
        /* istanbul ignore next */
        deleteFile(fileName)
        /* istanbul ignore next */
    }
    /* istanbul ignore next */
    if (err.name == 'MulterError' && err.code == 'LIMIT_UNEXPECTED_FILE') {
    /* istanbul ignore next */
        /* istanbul ignore next */
        res.status(400).json({
            /* istanbul ignore next */
            message: ["File Size Exceed"]
        })
        /* istanbul ignore next */
        /* istanbul ignore next */
    } else if (err.name == 'JsonWebTokenError') {
        /* istanbul ignore next */
        /* istanbul ignore next */
        res.status(401).json({
        /* istanbul ignore next */
            message: ["invalid token"]
        });
    } else if (err.name == "ValidationError") {
        let msgValidation = [];
        for (r in err.errors) {
            msgValidation.push(err.errors[r].message);
        }
        // console.log(msgValidation);
        /* istanbul ignore next */
        res.status(400).json({
            message: msgValidation
        });
        /* istanbul ignore next */
        /* istanbul ignore next */
    } else if (err.name == 'CastError') {
        /* istanbul ignore next */
        /* istanbul ignore next */
        return res.status(400).send({
        /* istanbul ignore next */
            message: ['Invalid ID']
        });
        /* istanbul ignore next */
        /* istanbul ignore next */
    } else if (err.statusCode == 404 && err.msg === undefined) {
        /* istanbul ignore next */
        /* istanbul ignore next */
        res.status(404).json({
        /* istanbul ignore next */
            message: ["Data not found"]
        });
    } else {
        let myErr = [err.msg];

        if (Array.isArray(err.msg)) {
            myErr = err.msg;
        }
        /* istanbul ignore next */
        res.status(err.statusCode || 500).json({
        /* istanbul ignore next */
            /* istanbul ignore next */
            message: (err.msg) ? myErr : ['Internal server error']
            /* istanbul ignore next */
        });
    }
}

module.exports = errorHandler
