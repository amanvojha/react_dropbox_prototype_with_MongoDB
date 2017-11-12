var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dropbox";


function handle_request(msg, callback){

    var res = {};
    var username = msg.username;
	var bio = msg.bio;
	var work = msg.work;
	var education = msg.education;
	var mobile = msg.mobile;
	var interest = msg.interest;
	var user = { username: username };
	var details = { $set : { bio: bio, work: work, education: education, mobile: mobile, interest: interest } };
	
    
    	MongoClient.connect(url, function(err,db){
                console.log('Connected to mongo at: ' + url);
                var dropbox_userinfo = db.collection("dropbox_userinfo");

                
                dropbox_userinfo.updateOne(user, details, function(err, response) {
                	if (err) {
        		    	throw err;
        		    }
        		    
        		    console.log('SET PROFILE')
					
        			res.code = "200";
        	        
        	        callback(null, res);
        		});
                
        });


    
}

exports.handle_request = handle_request;