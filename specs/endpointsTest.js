var database = require('../server/model/db');
var endpoints = require('../server/model/thespian');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var request = chai.request;
//var should = require('chai').should();
var expect = require('chai').expect;
//var supertest = require('supertest');
//var api = supertest('http://localhost:3000');
var app = require('../server/index.js')


describe('POST', function () {


    it('should respond to GET requests with a 200 status code', function(done) {
        request(app)
          .get('/#/thespians')
          //.expect(200)
          .end(function(err, res){
            expect(res).to.have.status(200);
            done();
          });
  });

    it('should send back a proper Content-Type header', function(done) {
        request(app)
          .get('/#/thespians')
          //.expect('Content-Type', /application\/json/)
          .end(function(err, res){
            expect(res).to.have.header('Content-Type', 'text/html; charset=UTF-8');
            done();
          });
  });
//     it('should post an actors data into into the thespian database', function (done) {
//         request(app)
//         .post('/thespians')
//         .send({data: {
//           "id": 31, 
//           "known_for": Array, 
//           "name": 'Tom Hanks', 
//           "popularity": 13.676511}
//         })
//         .end(function (err,res) {
//             //should.equal(err, null);  
//             //console.log("this is the post res: ", res);
//            // console.log("this is the post res.body: ", res.body);
//             expect(res).to.have.header('Content-Type', 'application/json; charset=utf-8'); 
//             expect(res).to.have.status(200);
//             expect(res.body).to.be.a('object');  
//             expect(res.body).to.have.property('id'); 
//             expect(res.body).to.have.property('known_for');
//             expect(res.body).to.have.property('name'); 
//             expect(res.body).to.have.property('popularity');
//             expect(res.body).id.to.be.a('number'); 
//             expect(res.body).known_for.to.be.a('array');
//             expect(res.body).name.to.be.a('string'); 
//             expect(res.body).popularity.to.be.a('number');  
//             done();
//         });
//     });
});

describe('GET', function () {
    it('should give back an actors information from the thespian database', function (done) {
          request(app)
            .get('/#/thespians?first+last')
            .end(function (err, res) {
              console.log("this is the get res: ", res);
              console.log("this is the get res.body: ", res.body);
                //should.equal(err, null);  
                expect(res).to.have.header('Content-Type', 'text/html; charset=UTF-8');  
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');  
                expect(res.body).to.have.property('id'); 
                expect(res.body).to.have.property('known_for');
                expect(res.body).to.have.property('name'); 
                expect(res.body).to.have.property('popularity');
                expect(res.body).id.to.be.a('number'); 
                expect(res.body).known_for.to.be.a('array');
                expect(res.body).name.to.be.a('string'); 
                expect(res.body).popularity.to.be.a('number'); 
                done();
            });
    });

});

