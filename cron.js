require('dotenv').config()
var CronJob = require('cron').CronJob;
var kue = require('kue')
    , queue = kue.createQueue();
const Voucers = require('./models/voucer');
const User = require('./models/user')

async function deleteTransaction(done) {

    Voucers.deleteMany({ expire_date: { "$lte": new Date() } })
        .then(voucers => {
            console.log(voucers)
            done()
        })
        .catch(err => {
            console.log(err)
        })

}
queue.process('deleteTransaction', function (job, done) {
    deleteTransaction(done);
});


module.exports = () => {
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
const PORT = process.env.KUE_PORT || 3001
kue.app.listen(PORT, () => {
    console.log(`🚀 CronJob KUE listening on port ${PORT}`)
});