const User = require('../../models/user');
const Voucer = require('../../models/voucer');

module.exports = function(done) {
  if (process.env.NODE_ENV === 'test') {
    let jobs = [User.deleteMany({}), Voucer.deleteMany({})]

    Promise.all(jobs)
    .then(function(){
      done()
    })
    .catch(function(err){
      done(err)
    })
  }
};