const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const photo = require('../helpers/photo');

chai.use(chaiHttp);
let expect = chai.expect;

let loggedUser = null
let loggedUserUnauthorization = null
let transaction = null
let fakeDataScane = {
    receipt_id: "B123",
    date: '2019-10-21',
    items: [
      { name: 'INDOMI GORENG SPC 80', qty: 1, price: 2500 },
      { name: 'INDOMIE CHITATO 100G', qty: 5, price: 3200 },
      { name: "SAMPERNA MILD 16'S", qty: 2, price: 23900 },
      { name: 'STT FRENCH FRIES 28G', qty: 3, price: 2800 }
    ],
    userid: '5db04612799c1a3fd093f83f',
    image_url: "tes/image.jpg"
  };

describe('Transactions', function () {
    before(function (done) {
        chai.request(app)
            .post('/users/login')
            .send({ email: 'candrasaputra@live.com', password: 'password123' })
            .end(function (err, res) {
                loggedUser = res.body
                done();
            })
    });
    
    before(function (done) {
        chai.request(app)
            .post('/users/login')
            .send({ email: 'user@mail.com', password: 'password123' })
            .end(function (err, res) {
                loggedUserUnauthorization = res.body
                done();
            })
    });
    
    it('Should return error message when create', (done) => {
        chai.request(app)
            .post('/transactions/receipt')
            .set('token', loggedUser.token)
            .send({
                "date": "",
                "items": []
            })
            .end(function (err, res) {
                expect(res.body).to.have.key('message')
                expect(res.body.message).to.be.an('Array')
                done()
            })
    })
    
    it('Should return created transaction', (done) => {
        chai.request(app)
            .post('/transactions/receipt')
            .set('token', loggedUser.token)
            .send({
                "date": "2019-10-21",
                "items": [
                    {
                        "name": "INDOMI GORENG SPC 80",
                        "qty": 1,
                        "price": 2500
                    },
                    {
                        "name": "INDOMIE CHITATO 100G",
                        "qty": 5,
                        "price": 3200
                    },
                    {
                        "name": "SAMPERNA MILD 16'S",
                        "qty": 2,
                        "price": 23900
                    },
                    {
                        "name": "STT FRENCH FRIES 28G",
                        "qty": 3,
                        "price": 2800
                    }
                ]
            })
            .end(function (err, res) {
                transaction = res.body
                expect(res.body).to.have.an('Object')
                expect(res.body).to.have.keys('total', 'items', '_id', 'date', 'userid', 'createdAt', 'updatedAt')
                expect(res.body.items).to.have.length(4)
                done()
            })
    })
    it('Should return created transaction', (done) => {
        chai.request(app)
            .post('/transactions/receipt')
            .set('token', loggedUser.token)
            .send({
                "date": "2019-10-21",
                "items": [
                    {
                        "name": "INDOMI GORENG SPC 80",
                        "qty": 1,
                        "price": 2500
                    },
                    {
                        "name": "INDOMIE CHITATO 100G",
                        "qty": 5,
                        "price": 3200
                    },
                    {
                        "name": "SAMPERNA MILD 16'S",
                        "qty": 2,
                        "price": 23900
                    },
                    {
                        "name": "STT FRENCH FRIES 28G",
                        "qty": 3,
                        "price": 2800
                    }
                ]
            })
            .end(function (err, res) {
                transaction = res.body
                expect(res.body).to.have.an('Object')
                expect(res.body).to.have.keys('total', 'items', '_id', 'date', 'userid', 'createdAt', 'updatedAt')
                expect(res.body.items).to.have.length(4)
                done()
            })
    })

    it('Should return all transaction', (done) => {
        chai.request(app)
            .get('/transactions')
            .set('token', loggedUser.token)
            .end(function (err, res) {
                expect(res.body).to.be.an('Array')
                expect(res.body[0]).to.be.an('Object')
                expect(res.body[0]).to.have.keys('items', '_id', 'date', 'userid', 'createdAt', 'updatedAt')
                done()
            })
    })

    it('Should return all transaction with range', (done) => {
        chai.request(app)
            .get('/transactions/findRange/2019-10-01/2019-10-30')
            .set('token', loggedUser.token)
            .end(function (err, res) {
                expect(res.body).to.be.an('Array')
                expect(res.body[0]).to.be.an('Object')
                expect(res.body[0]).to.have.keys('items', 'total', '_id', 'date', 'userid', 'createdAt', 'updatedAt')
                done()
            })
    })

    it('Should return one transaction by ID', (done) => {
        chai.request(app)
            .get(`/transactions/${transaction._id}`)
            .set('token', loggedUser.token)
            .end(function (err, res) {
                expect(res.body).to.be.an('Object')
                expect(res.body).to.have.keys('items', '_id', 'date', 'userid', 'createdAt', 'updatedAt')
                expect(res.body.items).to.be.an('Array')
                done()
            })
    })
    it('Should be able to be updated by ID ', (done) => {
        chai.request(app)
            .patch(`/transactions/${transaction._id}`)
            .set('token', loggedUser.token)
            .send({
                date: '2019-10-12',
            })
            .end(function (err, res) {
                expect(res.body).to.be.an('Object')
                expect(res.body).to.have.keys('message', 'receipt')
                expect(res.body.receipt).to.have.keys('items', '_id', 'date', 'userid', 'createdAt', 'updatedAt')
                done()
            })
    })
    
    it('Should return error unauthorized to be updated by ID ', (done) => {
        chai.request(app)
            .patch(`/transactions/${transaction._id}`)
            .set('token', loggedUserUnauthorization.token)
            .send({
                date: '2019-10-12',
            })
            .end(function (err, res) {
                expect(res.body).to.be.an('Object')
                expect(res.body).to.have.keys('message')
                done()
            })
    })

    it('Should return error unauthorized to delete by ID ', (done) => {
        chai.request(app)
            .delete(`/transactions/${transaction._id}`)
            .set('token', loggedUserUnauthorization.token)
            .end(function (err, res) {
                expect(res.body).to.be.an('Object')
                expect(res.body).to.have.keys('message')
                done()
            })
    });

    it('Should be able to delete by ID ', (done) => {
        chai.request(app)
            .delete(`/transactions/${transaction._id}`)
            .set('token', loggedUser.token)
            .end(function (err, res) {
                expect(res.body).to.have.keys('message', 'receipt')
                expect(res.body.message).to.be.equal('successfully deleted')
                expect(res.body.receipt).to.have.keys('items', '_id', 'date', 'userid', 'createdAt', 'updatedAt')
                done()
            })
    });
    
    it('Should return error bill id notfound when delete by ID ', (done) => {
        chai.request(app)
            .delete(`/transactions/${transaction._id}`)
            .set('token', loggedUserUnauthorization.token)
            .end(function (err, res) {
                expect(res.body).to.be.an('Object')
                expect(res.body).to.have.keys('message')
                done()
            })
    });

    this.timeout(500000);
    describe("POST /transactions", function () {
        it("Succesfully scan transactions", function (done) {
            chai
                .request(app)
                .post("/transactions")
                .set("token", loggedUser.token)
                .send(photo)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object")
                    expect(res.body).to.have.keys(["receipt_id", "date", "items", "image_url"]);
                    done();
                })
        })
    });
    it('Create new transaction', (done) => {
        chai.request(app)
            .post('/transactions/receipt')
            .set('token', loggedUser.token)
            .send(fakeDataScane)
            .end(function (err, res) {
                expect(res.body).to.be.an('Object')
                expect(res.body).to.have.keys('items', '_id', 'date', 'userid', "total", "image_url", "receipt_id", 'createdAt', 'updatedAt')
                done()
            })
    });
    
    it('error receipt_id duplicat transaction', (done) => {
        chai.request(app)
            .post('/transactions/receipt')
            .set('token', loggedUser.token)
            .send(fakeDataScane)
            .end(function (err, res) {
                expect(res.body).to.be.an('Object')
                expect(res.body.message).to.have.members([ "Can't add same receipt, this receipt already been input before." ])
                done()
            })
    });
})