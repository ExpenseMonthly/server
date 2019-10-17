const mongoose = require('mongoose');
const fs = require('fs');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require("../models/user");

chai.use(chaiHttp);
let expect = chai.expect;

describe('Authentication', function () {
    before(function (done) {
        mongoose.connection.db.dropDatabase(function (err) {
            console.log('db dropped');
            done();
        });
    });

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
                        point: 0
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
                        point: 0
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
                        point: 0
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
        it('Login member without error', function (done) {
            chai.request(app)
                .post('/users/login')
                .send({ email: 'candrasaputra@live.com', password: 'password123' })
                .end(function (err, res) {
                    customerToken = res.body.token;
                    expect(res.body).to.have.property('token');
                    expect(res.body).to.have.property('user');
                    expect(res.body.user).to.include.keys(['_id', 'name', 'email']);
                    expect(res).to.have.status(200);
                    done();
                })
        });

        it('Login admin without error', function (done) {
            chai.request(app)
                .post('/users/login')
                .send({ email: 'candrasaputra@live.com', password: 'password123' })
                .end(function (err, res) {
                    adminToken = res.body.token;
                    expect(res.body).to.have.property('token');
                    expect(res.body).to.have.property('user');
                    expect(res.body.user).to.include.keys(['_id', 'name', 'email']);
                    expect(res).to.have.status(200);
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
});