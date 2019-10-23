const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const clearDatabase = require("../helpers/test/clearDatabase");

chai.use(chaiHttp);
let expect = chai.expect;

let userToken = "";

before(function (done) {
    this.timeout(10000)
    console.log("before in user test")
    clearDatabase(done);
});
  
describe('Authentication', function () {
    describe('register', function () {
        it('Register without error', function (done) {
            chai.request(app)
                .post('/users/register')
                .send(
                    {
                        name: 'candra saputra',
                        email: 'candrasaputra@live.com',
                        password: 'password123',
                        gender: 'male',
                        profile_url: 'tes.jpg',
                        point: 0,
                        voucers: []
                    })
                .end(function (err, res) {
                    expect(res.body).to.have.property('name');
                    expect(res.body).to.have.property('email');
                    expect(res.body.name).to.equal('candra saputra');
                    expect(res.body.gender).to.equal('male');
                    expect(res.body.point).to.equal(0);
                    expect(res).to.have.status(201);
                    done();
                })
        });

        it('Error email has beem used', function (done) {
            chai.request(app)
                .post('/users/register')
                .send(
                    {
                        name: 'candra saputra',
                        email: 'candrasaputra@live.com',
                        password: 'password123',
                        gender: 'male',
                        profile_url: 'tes.jpg',
                        point: 0,
                        voucers: []
                    })
                .end(function (err, res) {
                    expect(res.body.message).to.have.members(['Email has been used']);
                    expect(res).to.have.status(400);
                    done();
                })
        });

        it('Error email and password format', function (done) {
            chai.request(app)
                .post('/users/register')
                .send(
                    {
                        name: 'candra saputra',
                        email: 'candrasaputra',
                        password: 'password',
                        gender: 'male',
                        profile_url: 'tes.jpg',
                        point: 0,
                        voucers: []
                    }
                )
                .end(function (err, res) {
                    expect(res.body.message).to.have.members(['Invalid Email', 'Password must contain at least one letter, one number, and minimum six characters']);
                    expect(res).to.have.status(400);
                    done();
                })
        });
    })

    describe('login', function () {

        it('Login without error', function (done) {
            chai.request(app)
                .post('/users/login')
                .send({ email: 'candrasaputra@live.com', password: 'password123' })
                .end(function (err, res) {
                    userToken = res.body.token;
                    expect(res.body).to.have.property('token');
                    expect(res.body).to.have.property('user');
                    expect(res.body.user).to.include.keys(['_id', 'name', 'email']);
                    expect(res).to.have.status(200);
                    done();
                })
        });
        
        it('Error email or password not found', function (done) {
            chai.request(app)
                .post('/users/login')
                .send({ email: 'candrasaputra2@live.com', password: 'password' })
                .end(function (err, res) {
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.have.members(['email/password not found']);
                    expect(res).to.have.status(400);
                    done();
                })
        });

        it('Error email and password required', function (done) {
            chai.request(app)
                .post('/users/login')
                .send({ email: '', password: '' })
                .end(function (err, res) {
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.have.members(['email is required', 'password is required']);
                    expect(res).to.have.status(400);
                    done();
                })
        });

        it('email/password not found', function (done) {
            chai.request(app)
                .post('/users/login')
                .send({ email: 'candra@mail.com', password: 'password123' })
                .end(function (err, res) {
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.have.members(['email/password not found']);
                    expect(res).to.have.status(400);
                    done();
                })
        });
    })

    describe('GET /users', function () {
        it("Succesfully get user", function (done) {
            chai
                .request(app)
                .get("/users")
                .set("token", userToken)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object")
                    expect(res.body).to.have.keys(["_id", "gender", "email", "point", "name", "voucers"]);
                    done();
                })
        })
        
        it("error token not found", function (done) {
            chai
                .request(app)
                .get("/users")
                .end(function (err, res) {
                    console.log(res.body.message);
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.have.members(['You are not authenticated user']);
                    done();
                })
        })
    })
    
    describe('GET /users/info', function () {
        it("Succesfully get user", function (done) {
            chai
                .request(app)
                .get("/users/info")
                .set("token", userToken)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object")
                    expect(res.body).to.have.keys(["__v","_id", "gender", "email", "point", "name", "password", "voucers", "createdAt", "updatedAt"]);
                    done();
                })
        })

        it("error token not found", function (done) {
            chai
                .request(app)
                .get("/users/info")
                .end(function (err, res) {
                    console.log(res.body.message);
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.have.members(['You are not authenticated user']);
                    done();
                })
        })
    })
    
    describe('PATCH /users/point', function () {
        it("Succesfully patch user point", function (done) {
            chai
                .request(app)
                .patch("/users/point")
                .set("token", userToken)
                .send({
                    point: 20
                })
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.user).to.be.an("object")
                    expect(res.body.user).to.have.keys(["__v","_id", "gender", "email", "point", "name", "password", "voucers", "createdAt", "updatedAt"]);
                    done();
                })
        })

        it("error token not found", function (done) {
            chai
                .request(app)
                .patch("/users/point")
                .send({
                    point: 20
                })
                .end(function (err, res) {
                    console.log(res.body.message);
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.have.members(['You are not authenticated user']);
                    done();
                })
        })
    })
});


