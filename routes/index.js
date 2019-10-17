const router = require('express').Router();

const UserRoute = require('./userRoute');

router.get('/', (req, res) => {
    res.status(200).json({
        "message": 'ok'
    });
});

router.use("/users", UserRoute)

router.get('/*', (req, res, next) => {
    next({ statusCode: 404, msg: 'Route not found' });
});

module.exports = router
