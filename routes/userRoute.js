const express = require('express');
const UserController = require('../controllers/userController');
const Authentication = require('../middleware/authentication');
const { multer, getPublicUrl, sendUploadToGCS } = require('../middleware/image');

const router = express.Router();

router.post('/register', multer.single('profile_url'), sendUploadToGCS, UserController.register);
router.post('/login', UserController.login);

router.get('/', Authentication, UserController.getUser);
router.get('/info', Authentication, UserController.getProfile);
router.patch('/point', Authentication, UserController.update);
module.exports = router;