var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dropbox";


function handle_request(msg, callback){

    var res = {};
    var parentId = msg.parentId;
    var username = msg.username;
    var query = { username: username };
    
    
    	MongoClient.connect(url, function(err,db){
                console.log('Connected to mongo at: ' + url);
                var dropbox_userinfo = db.collection("dropbox_userinfo");
                
                dropbox_userinfo.find(query).toArray(function(err, result) {
        		    if (err) {
        		    	throw err;
        		    }
    		    	
    		    	console.log('GET PROFILE')
					console.log(result);
        			res.code = "200";
        	        res.value = result;
        	        callback(null, res);
        		});
                
        });


    
}

exports.handle_request = handle_request;