var expect  = require('chai').expect;
const supertest = require('supertest');
const app = require('../app');

const server = supertest(app);

describe("Url Check", () => {
    it('HomePage Status', function(done) {
        this.timeout(15000);
        server
        .get('/')
        .end((err, res) => {
            expect(res.status).to.equal(200);
            if (err) done(err);
            done();
        });
    });
    it('LoginPage Status', function(done) {
        this.timeout(15000);
        server
        .get('/login')
        .end((err, res) => {
            expect(res.status).to.equal(200);
            if (err) done(err);
            done();
        });
    });
    it('RegisterPage Status', function(done) {
        this.timeout(15000);
        server
        .get('/register')
        .end((err, res) => {
            expect(res.status).to.equal(200);
            if (err) done(err);
            done();
        });
    });
    it('Direct ProductPage Status', function(done) {
        this.timeout(15000);
        server
        .get('/product')
        .end((err, res) => {
            expect(res.status).to.equal(404);
            if (err) done(err);
            done();
        });
    });
    it('Direct DealPage Status', function(done) {
        this.timeout(15000);
        server
        .get('/deal')
        .end((err, res) => {
            expect(res.status).to.equal(404);
            if (err) done(err);
            done();
        });
    });
    it('Real Specific DealPage Status', function(done) {
        this.timeout(15000);
        server
        .get('/deal/5e2736ac4380f63124bcae33')
        .end((err, res) => {
            expect(res.status).to.equal(200);
            if (err) done(err);
            done();
        });
    });
    it('ProfilePage Protect', function(done) {
        this.timeout(15000);
        server
        .get('/profile')
        .end((err, res) => {
            expect(res.status).to.equal(200);
            if (err) done(err);
            done();
        });
    });
    it('User Login Success', function(done) {
        this.timeout(15000);
        server
        .post('/login')
        .send({
            email:"johndoe@gmail.com",
            password:"johndoe"
        })
        .end((err, res) => {
            expect(res.status).to.equal(302);
            if (err) done(err);
            done();
        });
    });
    it('Cart Status', function(done) {
        this.timeout(15000);
        server
        .get('/cart')
        .end((err, res) => {
            expect(res.status).to.equal(200);
            if (err) done(err);
            done();
        });
    });
});
