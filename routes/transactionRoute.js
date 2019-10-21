const express = require('express');
const TransactionController = require('../controllers/transactionController');
const { multer, sendUploadToGCS, getPublicUrl } = require('../middleware/image');
const processText = require('../middleware/ocr')
const authentication = require('../middleware/authentication');
const { AuthorizationOwner } = require('../middleware/authorization');
const router = express.Router();

router.use(authentication);
router.get('/', TransactionController.findAll);

router.post('/', (req, res, next) => {
    if (!req.body.photo) return next()
    
    let imageName = req.body.photo.uri.split('/')[req.body.photo.uri.split('/').length - 1];
    
    let splitImage = imageName.split('.');
    req.file = {
        buffer: Buffer.from(req.body.photo.base64, 'base64'),
        mimetype: `image/${splitImage[1]}`,
        originalname: `${splitImage[0]}`
    }
    next()
}, sendUploadToGCS, processText );

router.post('/receipt', TransactionController.store);

router.get('/findRange/:startDate/:endDate', TransactionController.findRangeDate);

router.get('/:id', AuthorizationOwner, TransactionController.findOne);
router.patch('/:id', AuthorizationOwner, multer.single('file'), sendUploadToGCS, TransactionController.update);
router.delete('/:id', AuthorizationOwner, TransactionController.delete);

module.exports = router;
