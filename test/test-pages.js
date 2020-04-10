var expect  = require('chai').expect;
const supertest = require('supertest');
const app = require('../app');

const server = supertest.agent(app);

describe("Url Check", () => {
    it('Main page status', function(done) {
        server
        .get('/')
        .end((err, res) => {
            expect(res.status).to.equal(200);
            if (err) done(err);
            done();
        });
    });
    
    // it('Profile page content', function(done) {
    //     request('http://localhost:3000/profile' , function(error, response, body) {
    //         expect(response.statusCode).to.equal(200);
    //         done();
    //     });
    // });
});