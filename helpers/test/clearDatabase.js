const User = require('../../models/user');

module.exports = function(done) {
  if (process.env.NODE_ENV === 'test') {
    let jobs = [User.deleteMany({})]

    Promise.all(jobs)
    .then(function(){
      done()
    })
    .catch(function(err){
      done(err)
    })
  }
};