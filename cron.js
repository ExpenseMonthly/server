require('dotenv').config()
var CronJob = require('cron').CronJob;
var kue = require('kue')
    , queue = kue.createQueue();
const Voucers = require('./models/voucer');

async function deleteTransaction(done) {
    /* istanbul ignore next */
    Voucers.deleteMany({ expire_date: { "$lte": new Date() } })
        .then(voucers => {
            /* istanbul ignore next */
            console.log(voucers)
            /* istanbul ignore next */
            done()

        })
        /* istanbul ignore next */
        .catch(err => {
            /* istanbul ignore next */
            console.log(err)
        })
    /* istanbul ignore next */
}
queue.process('deleteTransaction', function (job, done) {
    /* istanbul ignore next */
    deleteTransaction(done);
});

/* istanbul ignore next */
module.exports = () => {
    /* istanbul ignore next */
    new CronJob('0 0 * * *', function () {
        console.log("Cron is running...")

        const job = queue.create('deleteTransaction').save();

        // job.on('complete', function () {
        //     console.log('Job completed with data ');
        // }).on('failed attempt', function (errorMessage, doneAttempts) {
        //     console.log('Job failed');
        // }).on('failed', function (errorMessage) {
        //     console.log('Job failed');
        // }).on('progress', function (progress, data) {
        //     console.log('Job in progress');
        // })

    }, null, true, 'Asia/Jakarta');
}
/* istanbul ignore next */
const PORT = process.env.KUE_PORT || 3001
kue.app.listen(PORT, () => {
    console.log(`🚀 CronJob KUE listening on port ${PORT}`)
});