const express = require('express');
const TransactionController = require('../controllers/transactionController');
const { multer, sendUploadToGCS, getPublicUrl } = require('../middleware/image');
const processText = require('../middleware/ocr')
const authentication = require('../middleware/authentication');
const { AuthorizationOwner } = require('../middleware/authorization');
const router = express.Router();

router.use(authentication);
router.get('/', TransactionController.findAll);
router.post('/', multer.single('file'), sendUploadToGCS, processText, TransactionController.store);


router.get('/:id', AuthorizationOwner, TransactionController.findOne);
router.patch('/:id', AuthorizationOwner, multer.single('file'), sendUploadToGCS, TransactionController.update);
router.delete('/:id', AuthorizationOwner, TransactionController.delete);

module.exports = router;
