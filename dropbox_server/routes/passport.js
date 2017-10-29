var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dropbox";
var bcrypt = require('bcrypt');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {
        try {
        	MongoClient.connect(url, function(err,db){
	                console.log('Connected to mongo at: ' + url);
	                var dropbox_userinfo = db.collection("dropbox_userinfo");
	                console.log('PASSPORT' + username + password)
	                
	                dropbox_userinfo.findOne({username: username}, function(err, user){
		                    console.log('PASS MONGO' + user.password)
		                    
		                    bcrypt.compare(password, user.password, function(err, check) {
							    // res == true
								
								if(check==true)
									{
										console.log('1')
				                        done(null, {username: username, password: password});
									}
								else 
									{
										console.log('2')
				                        done(null, false);
									}
							});
		                	
	                });
            });
        }
        catch (e){
            done(e,{});
        }
    }));
};