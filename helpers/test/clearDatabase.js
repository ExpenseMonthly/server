const User = require('../../models/user');
const Voucer = require('../../models/voucer');
const Transaction = require('../../models/transaction');

/* istanbul ignore next */
module.exports = function(done) {
/* istanbul ignore next */
  if (process.env.NODE_ENV === 'test') {
    let jobs = [User.deleteMany({}), Voucer.deleteMany({}), Transaction.deleteMany({})]

    Promise.all(jobs)
    .then(function(){
      done()
    })
  }
};