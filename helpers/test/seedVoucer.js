const Voucer = require('../../models/voucer');

let voucers = [
    {
        "title": "Voucher belanja Indomaret [Rp 500.000]",
        "image": "https://www.missionbaywatersports.co.nz/wp-content/uploads/Gift-Voucher-Example.jpg",
        "expire_date": "2019-11-20",
        "description": "-"
    },
    {
        "title": "Voucher diskon 50% belanja di Indomaret MAX. Rp 1.000",
        "image": "https://www.missionbaywatersports.co.nz/wp-content/uploads/Gift-Voucher-Example.jpg",
        "expire_date": "2019-11-09",
        "description": "-"
    }
]

module.exports = function (done) {
    if (process.env.NODE_ENV === 'test') {
        Voucer.insertMany(voucers)
            .then(result => {
                done()
            })
            .catch(done)
    }
};

