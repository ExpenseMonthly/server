const express = require('express');
const VoucerController = require('../controllers/voucerController');
const router = express.Router();
const authentication = require('../middleware/authentication');
const { multer, getPublicUrl, sendUploadToGCS } = require('../middleware/image');

router.use(authentication);
router.get('/', VoucerController.findAll);
router.post('/', multer.single('image'), sendUploadToGCS, VoucerController.store);

router.get('/:id', VoucerController.findOne);
router.patch('/:id', multer.single('image'), sendUploadToGCS, VoucerController.update);
router.delete('/:id', VoucerController.delete);

module.exports = router;
