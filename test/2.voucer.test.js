const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const seedVoucer = require("../helpers/test/seedVoucer");
const fs = require('fs');

chai.use(chaiHttp);
let expect = chai.expect;

let userToken = "";
let idVoucer = "";

before(function (done) {
    seedVoucer(done)
})

describe('Voucer', function () {
    before(function (done) {
        let user = {
            email: "candrasaputra@live.com",
            password: "password123"
        }
        chai
            .request(app)
            .post("/users/login")
            .send(user)
            .end(function (err, res) {
                userToken = res.body.token
                done();
            })
    })

    describe("GET /voucers", function () {
        it("Succesfully get all voucers", function (done) {
            chai
                .request(app)
                .get("/voucers")
                .set("token", userToken)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("array")
                    expect(res.body.length).to.equal(2)
                    res.body.forEach(element => {
                        expect(element).to.have.keys(["_id", "title", "image", "expire_date", "description", "__v", "createdAt", "updatedAt"])
                    });
                    idVoucer = res.body[0]._id
                    done();
                })
        })
        it("Should error get voucers without sending token to server (status: 401)", function (done) {
            chai
                .request(app)
                .get("/voucers")
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(401)
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body.message).to.have.members(['You are not authenticated user'])
                    done()
                })
        })
    })

    describe("GET /voucers/:id", function () {
        it("Succesfully get all voucers", function (done) {
            chai
                .request(app)
                .get("/voucers/" + idVoucer)
                .set("token", userToken)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object")
                    expect(res.body).to.have.keys(["__v", "_id", "title", "image", "expire_date", "description", "createdAt", "updatedAt"]);
                    done();
                })
        })
        it("Should error get voucers without sending token to server (status: 401)", function (done) {
            chai
                .request(app)
                .get("/voucers/" + idVoucer)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(401)
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body.message).to.have.members(['You are not authenticated user'])
                    done()
                })
        })
    })

    describe("POST /voucers", function () {
        it("Succesfully create voucer", function (done) {
            chai
                .request(app)
                .post("/voucers")
                .set("token", userToken)
                .field("title", "Diskon 30% di indomaret MAX Rp.40.000")
                .field("expire_date", "2019-10-10")
                .field("description", "-")
                .attach('image', fs.readFileSync('./img.jpg'), 'img.jpg')
                .end(function (err, res) {

                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an("object")
                    expect(res.body).to.have.keys(['_id', 'title', "expire_date", "description", "image", "__v", "createdAt", "updatedAt"]);
                    expect(res.body.title).to.equal("Diskon 30% di indomaret MAX Rp.40.000")
                    expect(res.body.expire_date).to.equal("2019-10-10T00:00:00.000Z")
                    expect(res.body.description).to.equal("-")
                    idVoucer = res.body._id
                    done();
                })
        })
        it("Should error get voucers without sending token to server (status: 401)", function (done) {
            chai
                .request(app)
                .post("/voucers")
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(401)
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body.message).to.have.members(['You are not authenticated user'])
                    done()
                })
        })
    })
})