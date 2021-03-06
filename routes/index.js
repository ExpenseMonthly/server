const router = require('express').Router();

const UserRoute = require('./userRoute');
const TransactionRoute = require('./transactionRoute');
const VoucerRoute = require('./voucerRoute');

router.get('/', (req, res) => {
    res.status(200).json({
        "message": 'ok'
    });
});

router.use("/users", UserRoute);
router.use("/transactions", TransactionRoute);
router.use("/voucers", VoucerRoute);

router.get('/*', (req, res, next) => {
    next({ statusCode: 404, msg: 'Route not found' });
});

module.exports = router
