var expect  = require('chai').expect;
var request = require('request');

describe("Url Check", () =>
{
    it('Main page status', function(done) {
        request('http://localhost:3000' , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    
    it('Profile page content', function(done) {
        request('http://localhost:3000/profile' , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});