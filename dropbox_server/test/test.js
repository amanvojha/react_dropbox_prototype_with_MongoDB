var assert = require('assert');
var express = require('express');
var app = require('../App.js');
var request = require('supertest');
var assert = require('chai').assert;

const username = Math.random()+"@admin.com";

it('should respond with success flag on', function(done) {
    request(app)
      .post('/api/getSharedFile')
      .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        done();
      });
 });
it('should respond with success flag on', function(done) {
    request(app)
      .post('/api/checkAuth')
      .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        done();
      });
 });
/*it('should respond with success flag on', function(done) {
    request(app)
      .post('/api/setHomeFiles')
      .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        done();
      });
 });

it('should respond with success flag on', function(done) {
    request(app)
      .post('/api/setFiles')
      .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        done();
      });
 });

it('should respond with success flag on', function(done) {
    request(app)
      .post('/api/getStar')
      .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        done();
      });
 });
it('should respond with success flag on', function(done) {
    request(app)
      .post('/api/getActivity')
      .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        done();
      });
 });
it('should respond with success flag on', function(done) {
    request(app)
      .post('/api/getProfile')
      .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        done();
      });
 });
it('should respond with success flag on', function(done) {
    request(app)
      .post('/api/getSharedFile')
      .send({"username":username,
    	  "password":"admin",
    	  "first_name":"admin",
    	  "last_name":"admin"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) done(err);
        done();
      });
 });*/