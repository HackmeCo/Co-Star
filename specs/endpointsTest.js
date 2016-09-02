var database = require('../server/model/db');
var endpoints = require('../server/model/thespian');
var chai = require('chai');
var chaihttp = require('chai-http');
var request = require('chai').request;
var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000');
var app = require('../server/index.js')

chai.use(chaihttp)

describe('POST', function () {


    it('should respond to GET requests with a 200 status code', function(done) {
        chai.request(app)
          .get('/thespians')
          .expect(200)
          .end(done);
  });

    it('should send back a proper Content-Type header', function(done) {
        chai.request(app)
          .get('/thespians')
          .expect('Content-Type', /application\/json/)
          .end(done);
  });
    it('should respond', function (done) {
       chai.request(app)
        .post('/thespians')
        .send({data: {
          "id": 31, 
          "known_for": Array, 
          "name": 'Tom Hanks', 
          "popularity": 13.676511}
        })
        .end(function (res) {
            should.equal(err, null);  
            res.should.be.json; 
            res.should.have.status(200);
            res.body.should.be.a('object');  
            res.body.should.have.property('id'); 
            res.body.should.have.property('known_for');
            res.body.should.have.property('name'); 
            res.body.should.have.property('popularity');
            res.body.id.should.be.a('number'); 
            res.body.known_for.should.be.a('array');
            res.body.name.should.be.a('string'); 
            res.body.popularity.should.be.a('number');  
            done();
        });
    });
});

describe('GET', function () {
    it('should list items on GET', function (done) {
        chai.request(app)
            .get('/thespians')
            .end(function (res) {
                should.equal(err, null);  
                res.should.be.json; 
                res.should.have.status(200);
                res.body.should.be.a('object');  
                res.body.should.have.property('id'); 
                res.body.should.have.property('known_for');
                res.body.should.have.property('name'); 
                res.body.should.have.property('popularity');
                res.body.id.should.be.a('number'); 
                res.body.known_for.should.be.a('array');
                res.body.name.should.be.a('string'); 
                res.body.popularity.should.be.a('number');  
                done();
            });
    });

});

