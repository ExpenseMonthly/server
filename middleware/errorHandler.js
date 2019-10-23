const deleteFile = require('../helpers/deleteFileGcs');

function errorHandler(err, req, res, next) {
    // console.log(err, `<<<<<<<<<<<,,,,,,,,,,,,,,,,`);
    // console.log(err.stack, `<<<<<<<<<<<,,,,,,,,,,,,,,,,`);
    if (req.file && req.file.cloudStoragePublicUrl) {
        let file = req.file.cloudStoragePublicUrl.split('/');
        let fileName = file[file.length - 1];
        deleteFile(fileName)
    }
    if (err.name == 'MulterError' && err.code == 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).json({
            message: ["File Size Exceed"]
        })
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
        res.status(400).json({
            message: msgValidation
        });
    } else if (err.name == 'CastError') {
        return res.status(400).send({
            message: ['Invalid ID']
        });
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
