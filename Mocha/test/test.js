var assert = require('assert');
var express = require('express');
var app = require('../App.js');
var request = require('supertest');
var assert = require('chai').assert;

var assert = require('assert');

let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();

chai.use(chaiHttp);


const username = Math.random()+"@admin.com";
it("Read Recent files", function (done)  {
    chai.request('http://localhost:3002/api')
        .post('/signup')
        .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
        .end(function(err, res) {
      	 
          assert.equal(res.status, 200);
          done();
        });
});
it("Read Recent files", function (done)  {
    chai.request('http://localhost:3002/api')
        .post('/login')
        .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
        .end(function(err, res) {
      	 
          assert.equal(res.status, 200);
          done();
        });
});
it("Read Recent files", function (done)  {
    chai.request('http://localhost:3002/api')
        .post('/getSharedFile')
        .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
        .end(function(err, res) {
      	 
          assert.equal(res.status, 200);
          done();
        });
});
it("Read Recent files", function (done)  {
    chai.request('http://localhost:3002/api')
        .post('/checkAuth')
        .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
        .end(function(err, res) {
      	 
          assert.equal(res.status, 200);
          done();
        });
});
it("Read Recent files", function (done)  {
    chai.request('http://localhost:3002/api')
        .post('/getProfile')
        .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
        .end(function(err, res) {
      	 
          assert.equal(res.status, 200);
          done();
        });
});
it("Read Recent files", function (done)  {
    chai.request('http://localhost:3002/api')
        .post('/getActivity')
        .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
        .end(function(err, res) {
      	 
          assert.equal(res.status, 200);
          done();
        });
});
it("Read Recent files", function (done)  {
    chai.request('http://localhost:3002/api')
        .post('/getStar')
        .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
        .end(function(err, res) {
      	 
          assert.equal(res.status, 200);
          done();
        });
});
it("Read Recent files", function (done)  {
    chai.request('http://localhost:3002/api')
        .post('/getGroup')
        .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
        .end(function(err, res) {
      	 
          assert.equal(res.status, 200);
          done();
        });
});
it("Read Recent files", function (done)  {
    chai.request('http://localhost:3002/api')
        .post('/getGroup')
        .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
        .end(function(err, res) {
      	 
          assert.equal(res.status, 200);
          done();
        });
});
it("Read Recent files", function (done)  {
    chai.request('http://localhost:3002/api')
        .post('/getGroup')
        .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
        .end(function(err, res) {
      	 
          assert.equal(res.status, 200);
          done();
        });
});
