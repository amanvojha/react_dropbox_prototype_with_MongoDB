var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dropbox";


function handle_request(msg, callback){

    var res = {};
    var parentId = msg.parentId;
    var username = msg.username;
    var isStarred = msg.isStarred;
    
    
    	MongoClient.connect(url, function(err,db){
                console.log('Connected to mongo at: ' + url);
                var dropbox_userfiles = db.collection("dropbox_userfiles");
                var User = { username: username,isStarred:true}
                
                dropbox_userfiles.find(User).toArray(function(err, files) {
            	    if (err) {
            	    	throw err;
            	    }
            	    else {
            	    	console.log('SET FILES')
            	    	console.log(files);
            			res.code = "200";
            	        res.value = files;
            	        callback(null, res);
            	    	
            	    }
            	
            	})
                
        });


    
}

exports.handle_request = handle_request;