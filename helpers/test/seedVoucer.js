const Voucer = require('../../models/voucer');

let voucers = [
    {
        "title": "Voucher belanja Indomaret [Rp 500.000]",
        "image": "https://www.missionbaywatersports.co.nz/wp-content/uploads/Gift-Voucher-Example.jpg",
        "expire_date": "2019-11-20",
        "description": "-",
        "point": 350
    },
    {
        "title": "Voucher diskon 50% belanja di Indomaret MAX. Rp 1.000",
        "image": "https://www.missionbaywatersports.co.nz/wp-content/uploads/Gift-Voucher-Example.jpg",
        "expire_date": "2019-11-09",
        "description": "-",
        "point": 300
    }
]

function seedVoucer (done) {
    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'test') {
    /* istanbul ignore next */
        Voucer.insertMany(voucers)
            .then(result => {
                done()
            })
            .catch(done)
    }
};

module.exports = seedVoucer
