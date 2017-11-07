var config = require('../config/config');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended : true});
var mysql = require('mysql');
const fileUpload = require('express-fileupload');
var bcrypt = require('bcrypt');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var cors = require('cors');
const MongoStore = require('connect-mongo')(session);
require('./passport')(passport);
var kafka = require('./kafka/client');


var corsOptions = {
	    origin: 'http://localhost:3000',
	    credentials: true,
	}



var pool = mysql.createPool({
	//details
	connectionLimit : 100,
	host : 'localhost',
	user : 'root',
	password : 'root',
	database : 'dropbox'
	
});

pool.getConnection(function(error,connection){
	if(!!error){
		console.log('Error');
		connection.release();
	}
	else {
		console.log('Connection Successful!!');
		connection.release();
	}
	
});

module.exports = function(app,db){
	app.use(bodyParser.urlencoded({
		  extended: true
	}));
	app.use(bodyParser.json());
	
	app.use(fileUpload());
	app.use(cookieParser());
	app.use(cors(corsOptions))
	
	app.use(session({
		  secret: 'Secret String',
		  resave: false,
		  saveUninitialized: false,
		  store: new MongoStore({ url: 'mongodb://localhost:27017/dropbox' })
		  //cookie: { secure: true }
	}))
	
	//Mongo Collections
	var dropbox_userinfo = db.collection("dropbox_userinfo");
	var dropbox_userfiles = db.collection("dropbox_userfiles");
	var dropbox_useractivity = db.collection("dropbox_useractivity");
	
	
	
	app.use(passport.initialize());
	app.use(passport.session());
	
	//LOGIN
	app.post('/api/login',urlencodedParser,function(req,res){

		console.log('SERVER LOGIN')
	    passport.authenticate('login', function(err, user) {
	        if(err) {
	        	console.log('3')
	            res.status(500).send();
	        }

	        if(!user) {
	        	console.log('4')
	            res.status(401).send();
	        }
	       req.session.user = user.username;
	        console.log(req.session.user);
	        console.log("session initilized");
	        req.login(user.username, function(err){
				console.log('Pass Matched');
				res.status(200).send();
			})
	    })(req, res);
	
	
	
	});
	
	//SIGN UP
	app.post('/api/signup',urlencodedParser, function(req,response){
		
		console.log('Form Data Received !!');
		console.log(req.body);
		var username = req.body.username;
		var password = req.body.password;
		var first_name = req.body.first_name;
		var last_name = req.body.last_name;
		var hashedPass;
		
		const saltRounds = 10;
		
    	kafka.make_request('request_topic',{"username": username,"password": password,
    										"first_name": first_name,"last_name": last_name ,
    										"topic":"signUp"}, function(err,results){
            console.log('in result');
            console.log(results);
            if(err){
                done(err,{});
            }
            else
            {	
            	console.log('RECEIVED FROM KAFKAAAAAAAAAA' + results.code)
                if(results.code == 200){
                	console.log('Received from kafka' + results.code)
                	console.log(results)
                	response.status(200).json({status:true});
                	
                }
                else {
                	console.log('Received Kafka false')
                	response.status(400).json({status:false})
                	
                    
                }
            }
        });
		
	});
	
		
	
	
	//UPLOAD RECENT HOME FILES
	app.post('/api/upload',urlencodedParser, function(req,response) {
		
		console.log('SERVER UPLOAD' + req.user + req.isAuthenticated());
		console.log(req.files);
		var username = req.user;
		var isFile = req.body.isFile;
		var parentId = req.body.parentId;
		
		let file=req.files.file;
		let fileName=req.files.file.name;
		var FileExist = { "username": username, "file_name": fileName };
		var UserExist = {"username": username, "parentId":parentId};
		var date = new Date();
		var millisec = date.getTime();
		var InsertNew = {
							"username": username,
							"fileId": millisec , 
							"file_name": fileName,
							"isStarred": false,
							"isOwner": true,
							"isFile": isFile,
							"parentId":parentId,
							"sharedWith":[{type:String}]
							//file_folder array if possible
	
						}

		
		var FindFile = { username:username,
						"file_name": fileName
			
		   }


		var Activity = {
				username:username,
				activity_id:millisec,
				activity:"Added File : " + fileName
		}

		
		if (!req.files){
		    return res.status(400).send('No files were uploaded.');
		}
		
		//Move File in Directory		
		file.mv('./data/'+fileName, function(err) {
			if (err){
					console.log("MV Failed")
			      response.status(500).send(err);
			}
			else{		
				dropbox_userfiles.find(FindFile).toArray(function(err, files) {
				    if (err) {
				    	throw err;
				    }
				    if(files.length==0) {
				    	console.log('UPLOAD')
				    	dropbox_userfiles.insertOne(InsertNew, function(err, res) {
					
							if(err){
								response.status(400).json({status:false})
							}
							else {
								console.log("Data Inserted Successfully !!"); 
								dropbox_userfiles.find(UserExist).toArray(function(err, files) {
								    if (err) {
								    	throw err;
								    }
								    else {
								    	
										//Inserty entry in activity collection
								    	
								    	dropbox_useractivity.insertOne(Activity, function(err, res) {
											
											if(err){
												response.status(400).json({status:false})
											}
											else {
										    	console.log('RETURN')
										    	console.log(files)
										    	response.status(200).json({files:files});
											}
											
										})
								    	

								    }
								    
								})
								
								
							}
					
				    	})
				    
				    	
				    }
				    else {
				    	console.log("File already present !!");
				    	dropbox_userfiles.find(UserExist).toArray(function(err, files) {
						    if (err) {
						    	throw err;
						    }
						    else {
						    	console.log('RETURN')
						    	console.log(files)
						    	response.status(200).json({files:files});
						    }
						    
						})
				    	
				    }
				
				})
			   
			}    
			
		})
		
		
		
	});
	
	//UPLOAD Folder
	app.post('/api/uploadFolder',urlencodedParser, function(req,response) {
		
		console.log('SERVER UPLOAD' + req.user + req.isAuthenticated());
		console.log(req.files);
		var username = req.user;
		var fileName = req.body.file_name;
		var isFile = req.body.isFile;
		var parentId = String(req.body.parentId);

		var FileExist = { "username": username, "file_name": fileName };
		var UserExist = {"username": username, "parentId":parentId};
		var date = new Date();
		var millisec = date.getTime();
		var InsertNew = {
							"username": username,
							"fileId": millisec , 
							"file_name": fileName,
							"isStarred": false,
							"isOwner": true,
							"isFile": isFile,
							"parentId":parentId,
							"sharedWith":[{type:String}]
							//file_folder array if possible
	
						}

		
		var FindFile = { username:username,
						"file_name": fileName
			
		   }

		

		
				dropbox_userfiles.find(FindFile).toArray(function(err, files) {
				    if (err) {
				    	throw err;
				    }
				    if(files.length==0) {
				    	console.log('UPLOAD')
				    	dropbox_userfiles.insertOne(InsertNew, function(err, res) {
					
							if(err){
								response.status(400).json({status:false})
							}
							else {
								console.log("Data Inserted Successfully !!"); 
								dropbox_userfiles.find(UserExist).toArray(function(err, files) {
								    if (err) {
								    	throw err;
								    }
								    else {
								    	console.log('RETURN')
								    	console.log(files)
								    	response.status(200).json({files:files});
								    }
								    
								})
								
								
							}
					
				    	})
				    
				    	
				    }
				    else {
				    	console.log("File already present !!");
				    	dropbox_userfiles.find(UserExist).toArray(function(err, files) {
						    if (err) {
						    	throw err;
						    }
						    else {
						    	console.log('RETURN')
						    	console.log(files)
						    	response.status(200).json({files:files});
						    }
						    
						})
				    	
				    }
				
				})
			   
		
		
	});
	
	
	
	//Set Home File list on refresh (5 recent)
	app.post('/api/setHomeFiles', function(req,res) {
		
		console.log('SET HOME FILES' + req.body.username);
		
		var username = req.body.username;
		var SetList="SELECT * FROM user_data WHERE username='"+ username +"' ORDER BY file_id DESC LIMIT 5 ";
				
		/*pool.getConnection(function(error,connection){
			
			connection.query(SetList, function(err , results){
				
				if (err) 
				{	
					connection.release();
					res.status(400);
				}	
				else
				{	
					connection.release();
					console.log('Server Return Star' + results);
					res.status(200).json({list:results});
				}
				
			});
		});*/
		
	});
	
	//Set All File list on refresh
	app.post('/api/setFiles', function(req,response) {
		
		console.log('SET FILES' + req.user + req.body.parentId);
		
		var username = req.user;
		var parentId = String(req.body.parentId);
		
		/*var UserExist = {"username": username, "parentId": parentId};*/
		var UserExist = {"parentId": parentId};
		
		
    	kafka.make_request('request_topic',{"parentId": parentId,"topic":"setFiles"}, function(err,results){
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
                	response.status(200).json({files:results.value});
                	
                }
                else {
                	console.log('Received Kafka false')
                	response.status(400).send();
                	
                    
                }
            }
        });
    	
		
	});


	//Starred Files
	app.post('/api/star',urlencodedParser, function(req,response) {
		
		console.log(req.body)
		var username = req.user;
		var file_id = req.body.file_id;
		var file_name = req.body.file_name;
		
		
		console.log('SERVER STAR : ' + file_name+file_id );
		
		
		
		kafka.make_request('request_topic',{username:username, "fileId":file_id,"file_name":file_name,"topic":"star"}, function(err,results){
            console.log('in result');
            console.log(results);
            if(err){
                done(err,{});
            }
            else
            {	
            	console.log('STAR RESPONSE')
            	console.log(results.code)
                if(results.code == 200){
                	console.log('Star Received from kafka')
                	console.log(results)
                	response.status(200).json({files:results.value});
                	
                }
                else {
                	console.log('Star Received Kafka false')
                	response.status(400).send();
                	
                    
                }
            }
        });
		
	});
	
	
	
	//Un_Starred Files
	app.post('/api/unstar', function(req,response) { 
		
		
			var username = req.user;
			var file_id = req.body.file_id;
			var file_name = req.body.file_name;
			
			
			
			console.log('SERVER STAR : ' + file_name+file_id );
			
			kafka.make_request('request_topic',{username:username, "fileId":file_id,"file_name":file_name,"topic":"unstar"}, function(err,results){
	            console.log('in result');
	            console.log(results);
	            if(err){
	                done(err,{});
	            }
	            else
	            {	
	            	console.log('STAR RESPONSE')
	            	console.log(results.code)
	                if(results.code == 200){
	                	console.log('Star Received from kafka')
	                	console.log(results)
	                	response.status(200).json({files:results.value});
	                	
	                }
	                else {
	                	console.log('Star Received Kafka false')
	                	response.status(400).send();
	                	
	                    
	                }
	            }
	        });
		
	});
	
	
	
	
	//Set Star File list on refresh
	app.post('/api/getStar', function(req,response) {
		
		console.log('SET STAR FILES' + req.user);
		
		var username = req.user;
		
		var User = { username: username,isStarred:true}
		
		
    	kafka.make_request('request_topic',{"username": username,"isStarred":true,"topic":"getStar"}, function(err,results){
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
                	response.status(200).json({files:results.value});
                	
                }
                else {
                	console.log('Received Kafka false')
                	response.status(400).send();
                	
                    
                }
            }
        });
		
		
		

		
	});
	
	
	//Download Files	
	app.get('/api/download', function(req,res) {
		
		
					
					var file_name = req.query.file_name;
					console.log('Download : ' + file_name);
					
					res.download('./data/' + file_name , file_name);
					
					//res.status(200).json({star_list:results});

		
	});


	
	//DELETE FILES
	app.post('/api/deleteFile', function(req,response) {
		
		console.log('DELETE FILE');
		var username = req.user;
		var file_id = req.body.file_id;
		var fileName = req.body.file_name;
		console.log(username);
		
		var FindFile = {username:username, "fileId":file_id};
		
		var User = { username: username}
		var date = new Date();
		var millisec = date.getTime();

		var Activity = {
				username:username,
				activity_id:millisec,
				activity:"Deleted File : " + fileName
		}
		
		
    	kafka.make_request('request_topic',{username:username, "fileId":file_id,"file_name":fileName,"topic":"deleteFile"}, function(err,results){
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
                	response.status(200).json({files:results.value});
                	
                }
                else {
                	console.log('Received Kafka false')
                	response.status(400).send();
                	
                    
                }
            }
        });
		

	});
	
	
	//Sending Activity Log
	app.post('/api/getActivity', function(req,response) {
		
		console.log('ACTIVITY : ' + req.user);
		
		var username = req.user;
		
		var User = { username: username}
		var Sort = {activity_id: -1}
		
    	kafka.make_request('request_topic',{username:username,"topic":"getActivity"}, function(err,results){
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
                	response.status(200).json({files:results.value});
                	
                }
                else {
                	console.log('Received Kafka false')
                	response.status(400).send();
                	
                    
                }
            }
        });	
		
		
		
		
	});
	
	//Updating User Profile
	app.post('/api/setProfile', function(req,response) {
		
		console.log('EDIT PROFILE : ' + req.body.username);

		
		var username = req.body.username;
		var bio = req.body.bio;
		var work = req.body.work;
		var education = req.body.education;
		var mobile = req.body.mobile;
		var interest = req.body.interest;
		
		var user = { username: username };
		var details = { $set : { bio: bio, work: work, education: education, mobile: mobile, interest: interest } };
		
		dropbox_userinfo.updateOne(user, details, function(err, res) {
		    if (err) throw err;
		    console.log("1 document updated");
		    response.status(200).json({status:true});
		});
		
		
	});
	
	//Setting User Profile
	app.post('/api/getProfile', function(req,response) {
		
		var username = req.user;
		console.log('SEND PROFILE : ' + username);
		var query = { username: username };
		
		kafka.make_request('request_topic',{username:username,"topic":"getProfile"}, function(err,results){
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
                	response.status(200).json({details:results.value});
                	
                }
                else {
                	console.log('Received Kafka false')
                	response.status(400).send();
                	
                    
                }
            }
        });


		
	});
	
	//Share File
	app.post('/api/shareFile', function(req,res) {
		
		var username = req.user;
		var fileId = req.body.file_id;
		var sharedWith = req.body.sharedWith;
		var FindFile = {"username":username, "fileId":fileId}
		var Set = {
					$push: {
							sharedWith:{
											"user": sharedWith
										}
						
					  	  }
				  }
		console.log('SHARE PROFILE : ' + username);
		console.log('SHARE PROFILE : ' + fileId);
		console.log('SHARE WITH : ' + sharedWith);
		
		
		dropbox_userfiles.update(FindFile, Set, function(err, files) {
			if (err) {
		    	throw err;
		    }
			else {
				
				res.status(200).send();
				
			}
			
			
		});
		
		

		
	});

	//Get Shared Files
	app.post('/api/getSharedFile', function(req,res) {
		
		var username = req.user;
		
		console.log('GET SHARE PROFILE : ' + username);
		
		var Search = {
						"sharedWith": {
										"user":username
									}
				
					 }
		
		dropbox_userfiles.find(Search).toArray(function(err, files) {
			if (err) {
		    	throw err;
		    }
			else {
				
				console.log('SharedWith')
				console.log(files)
				res.status(200).json({files:files});
				
			}
			
			
		});
		
		
	});
	
	//Check Server
	app.post('/api/checkAuth/', urlencodedParser, function(req, response) {
		
		
		
		console.log("Check Server Request !!");
		console.log(req.user);
		console.log(req.isAuthenticated());
		var isAuth = req.isAuthenticated();
		response.status(200).json({isAuth:isAuth,username:req.user})
		
		
	});
	
	app.post('/api/logout/', urlencodedParser, function(req, response) {
		
		
		
		console.log("Logout Server Request !!");
	    console.log(req.user);
	    req.logout();
	    req.session.destroy();
	    console.log('Session Destroyed');
	    response.status(200).send();
		
		
	});

	
	passport.serializeUser(function(username, done) {
		  console.log('Serialize');
		  done(null, username);
	});

	passport.deserializeUser(function(username, done) {
		console.log('De-Serialize');	
		done(null, username);
	});


};


