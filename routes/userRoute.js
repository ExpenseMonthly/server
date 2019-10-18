const express = require('express');
const UserController = require('../controllers/userController');
const { multer, getPublicUrl, sendUploadToGCS } = require('../middlewares/image');

const router = express.Router();

router.post('/register', multer.single('profile_url'), sendUploadToGCS, UserController.register);
router.post('/login', UserController.login);

module.exports = router;