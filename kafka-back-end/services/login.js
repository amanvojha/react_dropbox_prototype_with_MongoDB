var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dropbox";
var bcrypt = require('bcrypt');


function handle_request(msg, callback){

    var res = {};
    var username = msg.username;
    var password = msg.password;

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
									console.log('1 ' + username)
									res.code = "200";
							        res.value = username;
							        callback(null, res);
								}
							else 
								{
									console.log('2')
									res.code = "401";
							        res.value = "Failed Login";
							        callback(null, res);
								}
						});
	                    
	                	
                });
        });
    	
    
    
    /*console.log("In handle request:"+ JSON.stringify(msg));

    if(msg.username == "bhavan@b.com" && msg.password =="a"){
        res.code = "200";
        res.value = "Success Login";

    }
    else{
        res.code = "401";
        res.value = "Failed Login";
    }*/
    
}

exports.handle_request = handle_request;