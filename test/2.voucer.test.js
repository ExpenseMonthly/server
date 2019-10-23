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
                        expect(element).to.have.keys(["_id", "title", "image", "expire_date", "description", "point", "__v", "createdAt", "updatedAt"])
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
        it("Succesfully get voucer", function (done) {
            chai
                .request(app)
                .get("/voucers/" + idVoucer)
                .set("token", userToken)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object")
                    expect(res.body).to.have.keys(["__v", "_id", "title", "image", "expire_date", "description", "point", "createdAt", "updatedAt"]);
                    done();
                })
        })
        it("Should error get voucer without sending token to server (status: 401)", function (done) {
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
    let voucher = null
    this.timeout(500000);
    describe("POST /voucers", function () {
        it("Succesfully create voucer", function (done) {
            chai
                .request(app)
                .post("/voucers")
                .set("token", userToken)
                .field("title", "Diskon 30% di indomaret MAX Rp.40.000")
                .field("expire_date", "2019-10-10")
                .field("description", "-")
                .field("point", 250)
                .attach('image', fs.readFileSync('./img.jpg'), 'img.jpg')
                .end(function (err, res) {
                    voucher = res.body
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an("object")
                    expect(res.body).to.have.keys(['_id', 'title', "expire_date", "description", "image", "point", "__v", "createdAt", "updatedAt"]);
                    expect(res.body.title).to.equal("Diskon 30% di indomaret MAX Rp.40.000")
                    expect(res.body.expire_date).to.equal("2019-10-10T00:00:00.000Z")
                    expect(res.body.description).to.equal("-")
                    expect(res.body.point).to.equal(250)
                    idVoucer = res.body._id
                    done();
                })
        })

        it("Should error create voucer without sending token to server (status: 401)", function (done) {
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
        it('Should return user data with the added voucher', (done) => {
            chai
                .request(app)
                .post(`/users/voucers/${voucher._id}`)
                .set('token', userToken)
                .end(function (err, res) {
                    expect(err).to.be.null
                    expect(res.body).to.have.keys('message')
                    expect(res.body.message).to.be.equal('Point is not enough')
                    // expect(res.body).to.have.keys('status', 'user', 'message')
                    // expect(res.body.user).to.have.keys('point', 'voucers', '_id', 'name', 'email', 'password', 'gender', 'createdAt', 'updatedAt', '__v')
                    done()
                })
        })
    })

    describe("PATCH /voucers", function () {
        it("Succesfully update voucer", function (done) {
            chai
                .request(app)
                .patch("/voucers/" + idVoucer)
                .set("token", userToken)
                .field("title", "Diskon 30% di indomaret MAX Rp.40.000 2")
                .field("expire_date", "2019-10-11")
                .field("description", "- 2")
                .field("point", 450)
                .attach('image', fs.readFileSync('./img.jpg'), 'img.jpg')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an("object")
                    expect(res.body.data).to.have.keys(['_id', 'title', "expire_date", "description", "image", "point", "__v", "createdAt", "updatedAt"]);
                    expect(res.body.data.title).to.equal("Diskon 30% di indomaret MAX Rp.40.000 2")
                    expect(res.body.data.expire_date).to.equal("2019-10-11T00:00:00.000Z")
                    expect(res.body.data.description).to.equal("- 2")
                    expect(res.body.data.point).to.equal(450)
                    done();
                })
        })
        it("Should error update voucer without sending token to server (status: 401)", function (done) {
            chai
                .request(app)
                .patch("/voucers/" + idVoucer)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(401)
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body.message).to.have.members(['You are not authenticated user'])
                    done()
                })
        })
    })

    describe("DELETE /voucers/:id", function () {
        it("Should error delete voucer without sending token to server (status: 401)", function (done) {
            chai
                .request(app)
                .delete("/voucers/" + idVoucer)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(401)
                    expect(res.body).to.have.all.keys('message');
                    expect(res.body.message).to.have.members(['You are not authenticated user'])
                    done()
                })
        })

        it("Succesfully delete voucer", function (done) {
            chai
                .request(app)
                .delete("/voucers/" + idVoucer)
                .set("token", userToken)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an("object")
                    expect(res.body.data).to.have.keys(["__v", "_id", "title", "image", "expire_date", "description", "point", "createdAt", "updatedAt"]);
                    done();
                })
        })
    })
})


