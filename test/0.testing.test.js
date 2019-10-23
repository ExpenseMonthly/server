const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
let should = chai.should();

describe('Testing main api', function () {
    it('first test', function (done) {
        chai.request(app)
            .get('/')
            .end(function (req, res, next) {
                res.body.should.have.property('message');
                res.should.have.status(200);
                done();
            })
    })
})