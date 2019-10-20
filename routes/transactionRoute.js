const express = require('express');
const TransactionController = require('../controllers/transactionController');
const { multer, sendUploadToGCS, getPublicUrl } = require('../middleware/image');
const processText = require('../middleware/ocr')
const authentication = require('../middleware/authentication');
const { AuthorizationOwner } = require('../middleware/authorization');
const router = express.Router();

router.use(authentication);
router.get('/', TransactionController.findAll);
router.post('/', multer.single('file'),sendUploadToGCS, processText );
router.post('/receipt', TransactionController.store);
router.get('/findRange/:startDate/:endDate', TransactionController.findRangeDate);

router.delete('/:id', AuthorizationOwner, TransactionController.delete);

module.exports = router;
