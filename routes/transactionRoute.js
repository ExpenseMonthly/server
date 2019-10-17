const express = require('express');
const TransactionController = require('../controllers/transactionController');
const router = express.Router();

router.get('/', TransactionController.findAll);
router.post('/', TransactionController.store);

router.get('/:id', TransactionController.findOne);
router.patch('/:id', TransactionController.update);
router.delete('/:id', TransactionController.delete);

module.exports = router;
