const express = require('express');
const TransactionController = require('../controllers/transactionController');
const { multer, sendUploadToGCS, getPublicUrl } = require('../middleware/image');
const authentication = require('../middleware/authentication');
const router = express.Router();

router.use(authentication);
router.get('/', TransactionController.findAll);
router.post('/', multer.single('file'), sendUploadToGCS, TransactionController.store);

router.get('/:id', TransactionController.findOne);
router.patch('/:id', multer.single('file'), sendUploadToGCS, TransactionController.update);
router.delete('/:id', TransactionController.delete);

module.exports = router;
