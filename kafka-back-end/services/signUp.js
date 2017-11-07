var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dropbox";
var bcrypt = require('bcrypt');


function handle_request(msg, callback){

    var res = {};
	var hashedPass;
	const saltRounds = 10;
	
	var username = msg.username;
	var password = msg.password;
	var first_name = msg.first_name;
	var last_name = msg.last_name;
	
    MongoClient.connect(url, function(err,db){
                console.log('Connected to mongo at: ' + url);
                var dropbox_userinfo = db.collection("dropbox_userinfo");
               
                
                bcrypt.genSalt(saltRounds, function(err, salt) {
        		    bcrypt.hash(password, salt, function(err, hash) {
        		    	
        		    	var user= {
        						"username": username,
        						"password": hash,
        						"first_name": first_name,
        						"last_name": last_name
        				}
        				dropbox_userinfo.insertOne(user, function(err, response) {
        					
        					if(err){
        						
        						console.log('SIGN UP KAFKA Failed')
                    	    	res.code = "400";
                    	        res.value = "false";
                    	        callback(null, res);
        					}
        					else {
        						console.log('SIGN UP KAFKA Passed')
                    	    	res.code = "200";
                    	        res.value = "true";
                    	        callback(null, res);
        					}
        					
        				})
        		    	
        		    });
        		});
                
     });


    
}

exports.handle_request = handle_request;