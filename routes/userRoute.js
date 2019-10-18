const express = require('express');
const UserController = require('../controllers/userController');
const { multer, getPublicUrl, sendUploadToGCS } = require('../middleware/image');

const router = express.Router();

router.post('/register', multer.single('file'), sendUploadToGCS, UserController.register);
router.post('/login', UserController.login);

module.exports = router;