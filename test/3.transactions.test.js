const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const fs = require('fs');

chai.use(chaiHttp);
let expect = chai.expect;

// const user = {
//     name: 'candra saputra',
//     email: 'candrasaputra@live.com',
//     password: 'password123',
//     gender: 'male',
//     profile_url: 'tes.jpg',
//     point: 0
// }
let loggedUser = null
let transaction = {

}
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
    it('Should return all transction without error', (done) => {
        chai.request(app)
            .get('/transactions')
            .set('token', loggedUser.token)
            .end(function (err, res) {
                console.log(res.body, "<<<<< TRNASCATION")
                done()
            })
    })
    it('Should return created transaction', () => {
        chai.request(app)
            .post('/transactions')
            .set('token', loggedUser.token)
            .send({

            })
            .end(function (err, res) {
                console.log()
            })
    })
})

// describe('Transactions', function () {
//     this.timeout(500000);
//     describe.only('create transaction', function () {
//         it('Should return orc respond without error', function (done) {
//             chai.request(app)
//                 .post('/transactions')
//                 .set('token', userToken)
//                 .attach('file', fs.readFileSync('./testingImage.jpeg'), 'testingImage.jpeg')
//                 .end(function (err, res) {
//                     expect(res).to.have.status(200);
//                     expect(res.body).to.have.property(`items`);
//                     expect(res.body).to.have.property(`receipt_id`);
//                     expect(res.body).to.have.property(`date`);
//                     expect(res.body.receipt_id).to.include('2.1.50 930159/PRASSES/02');
//                     expect(res.body.items).to.be.an('Array');
//                     done();
//                 })
//         })

//         let orcRespond = {
//             items: [
//                 {
//                     name: 'TAO KAE CRISPY CLS',
//                     qty: 2,
//                     price: 4200
//                 },
//                 {
//                     name: 'PORORO STROBRI',
//                     qty: 1,
//                     price: 12200
//                 },
//                 {
//                     name: 'WALLS BRWN AVCDO',
//                     qty: 1,
//                     price: 5200
//                 },
//                 {
//                     name: 'KUSUKA KRP AYM LD',
//                     qty: 1,
//                     price: 8300
//                 }
//             ],
//             receipt_id: '2.1.50 930159/PRASSES/02',
//             date: '2019-10-17T13:02:00.000Z',
//         }
//         it.only('Should return orc respond without error', function (done) {
//             chai.request(app)
//                 .post('/transactions/receipt')
//                 .set('token', userToken)
//                 .send(orcRespond)
//                 .end(function (err, res) {
//                     expect(res).to.have.status(201);
//                     expect(res.body).to.have.property(`items`);
//                     expect(res.body).to.have.property(`receipt_id`);
//                     expect(res.body).to.have.property(`date`);
//                     expect(res.body.receipt_id).to.include('2.1.50 930159/PRASSES/02');
//                     expect(res.body.items).to.be.an('Array');
//                     done();
//                 })
//         })

//         orcRespond = {
//             items: [
//                 {
//                     name: 'TAO KAE CRISPY CLS',
//                     qty: 2,
//                     price: 4200
//                 },
//                 {
//                     name: 'PORORO STROBRI',
//                     qty: 1,
//                     price: 12200
//                 },
//                 {
//                     name: 'WALLS BRWN AVCDO',
//                     qty: 1,
//                     price: 5200
//                 },
//                 {
//                     name: 'KUSUKA KRP AYM LD',
//                     qty: 1,
//                     price: 8300
//                 }
//             ],
//             receipt_id: '2.1.50 930159/PRASSES/02',
//             date: '2019-10-17T13:02:00.000Z',
//         }
//         it.only('Should return orc respond without error', function (done) {
//             chai.request(app)
//                 .post('/transactions/receipt')
//                 .set('token', userToken)
//                 .send(orcRespond)
//                 .end(function (err, res) {
//                     console.log(res.body);
//                     // expect(res).to.have.status(201);
//                     // expect(res.body).to.have.property(`items`);
//                     // expect(res.body).to.have.property(`_id`);
//                     // expect(res.body).to.have.property(`receipt_id`);
//                     // expect(res.body).to.have.property(`date`);
//                     // expect(res.body).to.have.property(`userid`);
//                     // expect(res.body).to.have.property(`createdAt`);
//                     // expect(res.body).to.have.property(`updatedAt`);
//                     // expect(res.body.receipt_id).to.include('2.1.50 930159/PRASSES/02');
//                     // expect(res.body.items).to.be.an('Array');
//                     // expect(res.body.userid).to.include('5da9b9287b2e4464f73b6717');
//                     done();
//                 })
//         })

//         it('Should return error', function (done) {
//             chai.request(app)
//                 .post('/transactions')
//                 .set('token', userToken)
//                 .send()
//                 .end(function (err, res) {
//                     expect(res).to.have.status(400);
//                     expect(res.body.message).to.be.an('Array');
//                     done();
//                 })
//         })

//         it('Should return error you are not authenticated user', function (done) {
//             chai.request(app)
//                 .post('/transactions')
//                 .send()
//                 .end(function (err, res) {
//                     console.log(res);
//                     console.log(res.body);
//                     expect(res).to.have.status(401);
//                     expect(res.body.message).to.be.an('Array');
//                     expect(res.body.message[0]).to.be.an('String');
//                     expect(res.body).to.have.key('message');
//                     expect(res.body.message).to.include('You are not authenticated user');
//                     done();
//                 })
//         })
//     })

//     describe('get all transaction', function () {
//         it('shout get all user receipt without error', function (done) {
//             chai.request(app)
//                 .get('/transactions')
//                 .set('token', userToken)
//                 .end(function (err, res) {
//                     expect(res).to.have.status(200);
//                     expect(res.body).to.be.an('Array');
//                     expect(res.body[0]).to.be.an('Object');
//                     expect(res.body[0]).to.include.all.keys('_id', 'items', 'receipt_id', 'date', 'userid', 'createdAt', 'updatedAt');
//                     done();
//                 })
//         })


//         it('Should return error you are not authenticated user', function (done) {
//             chai.request(app)
//                 .post('/transactions')
//                 .send()
//                 .end(function (err, res) {
//                     console.log(res);
//                     console.log(res.body);
//                     expect(res).to.have.status(401);
//                     expect(res.body.message).to.be.an('Array');
//                     expect(res.body.message[0]).to.be.an('String');
//                     expect(res.body).to.have.key('message');
//                     expect(res.body.message).to.include('You are not authenticated user');
//                     done();
//                 })
//         })
//     })
//     const paramId = `5daab44a4f12d466a879c4ef`;
//     describe('get one transaction', function () {
//         it('shout get one user receipt without error', function (done) {
//             chai.request(app)
//                 .get(`/transactions/${paramId}`)
//                 .set('token', userToken)
//                 .end(function (err, res) {
//                     expect(res).to.have.status(200);
//                     expect(res.body).to.be.an('Object');
//                     expect(res.body).to.include.all.keys('_id', 'items', 'receipt_id', 'date', 'userid', 'createdAt', 'updatedAt');
//                     done();
//                 })
//         })


//         it('Should return error you are not authenticated user', function (done) {
//             chai.request(app)
//                 .post('/transactions')
//                 .send()
//                 .end(function (err, res) {
//                     console.log(res);
//                     console.log(res.body);
//                     expect(res).to.have.status(401);
//                     expect(res.body.message).to.be.an('Array');
//                     expect(res.body.message[0]).to.be.an('String');
//                     expect(res.body).to.have.key('message');
//                     expect(res.body.message).to.include('You are not authenticated user');
//                     done();
//                 })
//         })
//     })
//     // =======================
//     describe('delete one transaction', function () {
//         it('shout delete one user receipt without error', function (done) {
//             chai.request(app)
//                 .delete(`/transactions/${paramId}`)
//                 .set('token', userToken)
//                 .end(function (err, res) {
//                     expect(res.body).to.have.all.keys('message', 'receipt');
//                     expect(res.body.message).to.include('successfully deleted');
//                     expect(res).to.have.status(200);
//                     expect(res.body.receipt).to.have.all.keys('items', '_id', 'receipt_id', 'date', 'userid', 'image_url', 'createdAt', 'updatedAt');
//                     done();
//                 })
//         })


//         it('Should return error you are not authenticated user', function (done) {
//             chai.request(app)
//                 .delete(`/transactions/${paramId}`)
//                 .send()
//                 .end(function (err, res) {
//                     console.log(res);
//                     console.log(res.body);
//                     expect(res).to.have.status(401);
//                     expect(res.body.message).to.be.an('Array');
//                     expect(res.body.message[0]).to.be.an('String');
//                     expect(res.body).to.have.key('message');
//                     expect(res.body.message).to.include('You are not authenticated user');
//                     done();
//                 })
//         })
//     })
// })