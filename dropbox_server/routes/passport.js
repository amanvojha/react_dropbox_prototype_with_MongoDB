var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dropbox";
var bcrypt = require('bcrypt');
var kafka = require('./kafka/client');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {
    	console.log('LOCAL STRATEGY')
    	
    	kafka.make_request('request_topic',{"username":username,"password":password,"topic":"login"}, function(err,results){
            console.log('in result');
            console.log(results);
            if(err){
                done(err,{});
            }
            else
            {
                if(results.code == 200){
                	console.log('Received from kafka')
                	console.log(results)
                	done(null, {username: username});
                }
                else {
                	console.log('Received Kafka false')
                    done(null,false);
                }
            }
        });
    	
    	
    }));
};