const deleteFile = require('../helpers/deleteFileGcs');

function errorHandler(err, req, res, next) {
    // console.log(err, `<<<<<<<<<<<,,,,,,,,,,,,,,,,`);
    // console.log(err.stack, `<<<<<<<<<<<,,,,,,,,,,,,,,,,`);
    if (req.file && req.file.cloudStoragePublicUrl) {
        /* istanbul ignore next */
        let file = req.file.cloudStoragePublicUrl.split('/');
        /* istanbul ignore next */
        let fileName = file[file.length - 1];
        /* istanbul ignore next */
        deleteFile(fileName)
    }
    if (err.name == 'MulterError' && err.code == 'LIMIT_UNEXPECTED_FILE') {
        /* istanbul ignore next */
        res.status(400).json({
            /* istanbul ignore next */
            message: ["File Size Exceed"]
        })
        /* istanbul ignore next */
    } else if (err.name == 'JsonWebTokenError') {
        res.status(401).json({
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
    } else if (err.name == 'CastError') {
        return res.status(400).send({
            message: ['Invalid ID']
        });
        /* istanbul ignore next */
    } else if (err.statusCode == 404 && err.msg === undefined) {
        res.status(404).json({
            message: ["Data not found"]
        });
    } else {
        let myErr = [err.msg];

        if (Array.isArray(err.msg)) {
            myErr = err.msg;
        }
        res.status(err.statusCode || 500).json({
            message: (err.msg) ? myErr : ['Internal server error']
        });
    }
}

module.exports = errorHandler
