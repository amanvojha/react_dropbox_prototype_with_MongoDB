var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dropbox";


function handle_request(msg, callback){

    var res = {};
    var parentId = msg.parentId;
    

    	MongoClient.connect(url, function(err,db){
                console.log('Connected to mongo at: ' + url);
                var dropbox_userfiles = db.collection("dropbox_userfiles");
                var UserExist = {"parentId": parentId};
                
                dropbox_userfiles.find(UserExist).toArray(function(err, files) {
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