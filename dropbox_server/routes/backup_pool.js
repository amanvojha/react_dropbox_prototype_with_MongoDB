var config = require('../config/config');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended : false});
var mysql = require('mysql');
const fileUpload = require('express-fileupload');


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

module.exports = function(app){
	app.use(bodyParser());
	app.use(fileUpload());
	
	//LOGIN
	app.post('/api/login',urlencodedParser,function(req,res){

		console.log('Addition Request Received !!' + req.body);
		var username = req.body.username;
		var password = req.body.password;
		var dbpass;
		
		var queSel="SELECT * from users WHERE username='"+username+"'";
		
		console.log('Received' + username + " "  + password);
		
		
		pool.getConnection(function(error,connection){
			
		
					connection.query(queSel, function(err , results){
						
						if (err)
						{
							connection.release();
							res.status(400);
						}
						if(results.length)
						{
							connection.release();
							//console.log(" Data : " + results[0].first_name);
							dbpass = results[0].password;
							
							//Matching Passwords
							if(password===dbpass)
								{
									console.log("Matched!!");
									console.log(results);
															
									//Token Creation
									const token = jwt.sign({
										
										username: username
									},config.jwtSecret);
									
									res.json({token});
									
								}
							else
								{
									console.log("Wrong Password");
									res.json({token:''});
								}
						}
						else
						{
							connection.release();
							console.log('Wrong Credentials !!');
							res.json({status:false});
						}
					});

		});
	});
	
	//SIGN UP
	app.post('/api/signup',urlencodedParser, function(req,res){
		
		console.log('Form Data Received !!');
		console.log(req.body);
		var username = req.body.username;
		var password = req.body.password;
		var first_name = req.body.first_name;
		var last_name = req.body.last_name;
		var dbpass;
		
		var queIns="INSERT into users ( first_name, last_name, username, password) values ('" + first_name + "','" + last_name + "','" + username + "','" + password + "')";
		
		//console.log(queIns);
				
				
		pool.getConnection(function(error,connection){
			
		
				connection.query(queIns, function(err , results){
					
					if (err) 
						{
						connection.release();
						res.status(400).json({status:false});
						}
					else
						{
							connection.release();
							console.log("Data entered Successfully");
							res.status(200).json({status:true});
							//res.render('successSignUp');
						
						}
				});
		
		});
	});
	
	//UPLOAD FILES
	app.post('/api/upload', function(req,res) {
		
		console.log('SERVER UPLOAD');
		console.log(req.files);
		var username = req.body.username;
		console.log(username);
		
		let file=req.files.file;
		let fileName=req.files.file.name;
		var InsData="INSERT into user_data ( username, file_name, file_path) values ('" + username + "','" + fileName + "','./data/')";
		var FileList="SELECT * FROM user_data WHERE username='"+ username +"'";
		var FileExist = "SELECT * FROM user_data WHERE username='"+ username +"' AND file_name='" + fileName + "'";
		var InsActivity = "INSERT into user_activity (username, file_name, activity) VALUES ('" + username + "','" + fileName + "','Added File : " + fileName + "')";
		
		console.log('FILE EXIST QUERY' + FileExist);
		console.log('FILE INSERT : ' + InsData);
		console.log('Activity : ' + InsActivity);
		
		if (!req.files){
		    return res.status(400).send('No files were uploaded.');
		}
		
		//Move File in Directory		
		file.mv('./data/'+fileName, function(err) {
			if (err){
			      return res.status(500).send(err);
			}
			else{			
				
					pool.getConnection(function(error,connection){
					
						connection.query(FileExist, function(err , results){
							
							if (err) 
							{
								connection.release();
								console.log("Error");
								res.status(400);
							}
							if(!results[0])
								{
									connection.release();
									console.log('Allow Insert');
									//Insert file info in database
									connection.query(InsData, function(err , results){
										
										if (err) 
											{
											console.log("File Upload Failed");
											res.status(400);
											}
										else
											{
													//Making entry in Activity Table
													connection.query(InsActivity, function(err , results){
														if (err) 
														{
															console.log("File Activity Failed");
															
														}
														else
														{
															console.log("Activity Table Updated");
														}	
														
														
													});
											
											
													//Return with list of all files in directory
													console.log("Data entered Successfully");
													//res.render('successSignUp');
													
													connection.query(FileList, function(err , results){
														
														if (err) 
														{
															res.status(400);
														}	
														else
														{
															res.status(200).json({list:results});
														}
														
													});
												
											
											}
									});
									
								}
							else {
								connection.release();
								console.log('File Exists');
								res.status(400);
							}
						})//End
						
					});
			   
			}    
			
		})
		
		
	});
	
	
	
	//UPLOAD RECENT HOME FILES
	app.post('/api/uploadHome', function(req,res) {
		
		console.log('SERVER 5 UPLOAD');
		console.log(req.files);
		var username = req.body.username;
		console.log(username);
		
		let file=req.files.file;
		let fileName=req.files.file.name;
		var InsData="INSERT into user_data ( username, file_name, file_path) values ('" + username + "','" + fileName + "','./data/')";
		var FileList="SELECT * FROM user_data WHERE username='"+ username +"' ORDER BY file_id DESC LIMIT 5 ";
		var FileExist = "SELECT * FROM user_data WHERE username='"+ username +"' AND file_name='" + fileName + "'";
		var InsActivity = "INSERT into user_activity (username, file_name, activity) VALUES ('" + username + "','" + fileName + "','Added File : " + fileName + "')";
		
		console.log('FILE EXIST QUERY' + FileExist);
		console.log('FILE INSERT : ' + InsData);
		
		if (!req.files){
		    return res.status(400).send('No files were uploaded.');
		}
		
		//Move File in Directory		
		file.mv('./data/'+fileName, function(err) {
			if (err){
			      return res.status(500).send(err);
			}
			else{			
					pool.getConnection(function(error,connection){
				
						connection.query(FileExist, function(err , results){
							
							if (err) 
							{
								connection.release();
								console.log("Error");
								res.status(400);
							}
							if(!results[0])
								{
									connection.release();
									console.log('Allow Insert');
									//Insert file info in database
									connection.query(InsData, function(err , results){
										
										if (err) 
											{
											console.log("File Upload Failed");
											res.status(400);
											}
										else
											{
												//Making entry in Activity Table
												connection.query(InsActivity, function(err , results){
													if (err) 
													{
														console.log("File Activity Failed");
														
													}
													else
													{
														console.log("Activity Table Updated");
													}	
													
													
												});
											
												//Return with list of all files in directory
												console.log("Data entered Successfully");
												//res.render('successSignUp');
												
												connection.query(FileList, function(err , results){
													
													if (err) 
													{
														res.status(400);
													}	
													else
													{
														res.status(200).json({list:results});
													}
													
												});
												
											
											}
									});
									
								}
							else {
								connection.release();
								console.log('File Exists');
								res.status(400);
							}
						})//End
					});
						
						
			   
			}    
			
		})
		
		
	});
	
	
	
	
	//Set Home File list on refresh (5 recent)
	app.post('/api/setHomeFiles', function(req,res) {
		
		console.log('SET HOME FILES' + req.body.username);
		
		var username = req.body.username;
		var SetList="SELECT * FROM user_data WHERE username='"+ username +"' ORDER BY file_id DESC LIMIT 5 ";
				
		pool.getConnection(function(error,connection){
			
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
		});
		
	});
	
	//Set All File list on refresh
	app.post('/api/setFiles', function(req,res) {
		
		console.log('SET FILES' + req.body.username);
		
		var username = req.body.username;
		var SetList="SELECT file_name,file_id FROM user_data WHERE username='"+ username +"'";
				
		pool.getConnection(function(error,connection){	
			connection.query(SetList, function(err , results){
				
				if (err) 
				{
					connection.release();
					res.status(400);
				}	
				else
				{
					connection.release();
					res.status(200).json({list:results});
				}
				
			});
		});
		
	});


	//Starred Files
	app.post('/api/star', function(req,res) {
		
		
		var username = req.body.username;
		var file_id = req.body.file_id;
		var fileName = req.body.file_name;
		console.log('SERVER STAR : ' + username + file_id );
		var StarQuery="UPDATE user_data SET isStarred='true' WHERE username='"+ username +"' AND file_id='"+ file_id +"'";
		var StarList="SELECT * FROM user_data WHERE username='"+ username +"' AND isStarred='true'";
		
		var InsActivity = "INSERT into user_activity (username, file_name, activity) VALUES ('" + username + "','" + fileName + "','Starred File : " + fileName + "')";
		
		console.log('Server File Name :' + fileName)
		console.log(StarQuery);
		
		//STAR Files
		
		pool.getConnection(function(error,connection){	
			connection.query(StarQuery, function(err , results){
				
				if (err) 
					{
						connection.release();
						res.status(400);
					}
				else
					{
						connection.release();
						//Making entry in Activity Table
						connection.query(InsActivity, function(err , results){
							if (err) 
							{
								console.log("File Activity Failed");
								
							}
							else
							{
								console.log("Activity Table Updated");
							}	
							
							
						});
					
					
						//Return with list of all starred files in directory
						console.log("Marked Star");
						
						connection.query(StarList, function(err , results){
							
							if (err) 
							{
								res.status(400);
							}	
							else
							{
								console.log('Server Return Star' + results);	
								res.status(200).json({star_list:results});
							}
							
						});
						
					
					}
			});//End
		});
		
		
		
	});
	
	
	
	//Un_Starred Files
	app.post('/api/unstar', function(req,res) {
		
		
		var username = req.body.username;
		var file_id = req.body.file_id;
		var fileName = req.body.file_name;
		console.log('SERVER STAR : ' + username + file_id );
		var StarQuery="UPDATE user_data SET isStarred='false' WHERE username='"+ username +"' AND file_id='"+ file_id +"'";
		var StarList="SELECT file_name,file_id FROM user_data WHERE username='"+ username +"' AND isStarred='true'";
		var InsActivity = "INSERT into user_activity (username, file_name, activity) VALUES ('" + username + "','" + fileName + "','Un-Starred File : " + fileName + "')";
		console.log(StarQuery);
		
		//STAR Files
		pool.getConnection(function(error,connection){
			connection.query(StarQuery, function(err , results){
				
				if (err) 
					{
						connection.release();
						res.status(400);
					}
				else
					{
						connection.release();
						//Making entry in Activity Table
						connection.query(InsActivity, function(err , results){
							if (err) 
							{
								console.log("File Activity Failed");
								
							}
							else
							{
								console.log("Activity Table Updated");
							}	
							
							
						});
					
						//Return with list of all starred files in directory
						console.log("Marked Star");
						
						connection.query(StarList, function(err , results){
							
							if (err) 
							{
								res.status(400);
							}	
							else
							{
								console.log('Server Return Star' + results);	
								res.status(200).json({star_list:results});
							}
							
						});
						
					
					}
			});
		});
		
		
		
	});
	
	
	
	
	//Set Star File list on refresh
	app.post('/api/getStar', function(req,res) {
		
		console.log('SET STAR FILES' + req.body.username);
		
		var username = req.body.username;
		var GetStarList="SELECT file_name,file_id FROM user_data WHERE username='"+ username +"' AND isStarred='true'";
				
		pool.getConnection(function(error,connection){	
			connection.query(GetStarList, function(err , results){
				
				if (err) 
				{
					connection.release();
					res.status(400);
				}	
				else
				{
					connection.release();
					console.log('Server Return Star' + results);	
					res.status(200).json({star_list:results});
				}
				
			});
		});
		
	});
	
	
	//Download Files	
	app.get('/api/download', function(req,res) {
		
		console.log('DOWNLOAD FILES' + req.body.username + req.body.file_name);
				
		var username = req.query.username;
		var file_name = req.query.file_name;
		var DownFile="SELECT file_path FROM user_data WHERE username='"+ username +"' AND file_name='" + file_name +"'";
		console.log('Qeury : ' + DownFile);
				
		pool.getConnection(function(error,connection){		
			connection.query(DownFile, function(err , results){
				
				if (err) 
				{
					connection.release();
					res.status(400);
				}	
				else
				{
					connection.release();
					console.log('Download Result : ' + results);	
					
					res.download(results[0].file_path + file_name , file_name);
					
					//res.status(200).json({star_list:results});
				}
				
			});
		});
		
	});


	
	//DELETE FILES
	app.post('/api/deleteFile', function(req,res) {
		
		console.log('DELETE FILE');
		var username = req.body.username;
		var file_id = req.body.file_id;
		var fileName = req.body.file_name;
		console.log(username);
		
		
		var DelData="DELETE from user_data WHERE username='" + username + "' AND file_id='" + file_id + "'";
		var SetList="SELECT * FROM user_data WHERE username='"+ username +"' ORDER BY file_id DESC LIMIT 5 ";
		var FileList="SELECT * FROM user_data WHERE username='"+ username +"'";
		var InsActivity = "INSERT into user_activity (username, file_name, activity) VALUES ('" + username + "','" + fileName + "','Deleted File : " + fileName + "')";
		
		console.log('DELETE QUERY' + DelData);
		
			
		pool.getConnection(function(error,connection){
			connection.query(DelData, function(err , results){
				
				if (err) 
					{
						connection.release();
						res.status(400);
					}
				else
					{
						connection.release();
						//Making entry in Activity Table
						connection.query(InsActivity, function(err , results){
							if (err) 
							{
								console.log("File Activity Failed");
								
							}
							else
							{
								console.log("Activity Table Updated");
							}	
							
							
						});
					
						//Return with list of all files in directory
						console.log("All Files");
						
						connection.query(FileList, function(err , results){
							
							if (err) 
							{
								res.status(400);
							}	
							else
							{
								//Return Recent files
								console.log('Recent 5 files');	
								connection.query(SetList, function(err , results2){
									
									if (err) 
									{
										res.status(400);
									}	
									else
									{
										console.log('Return Files');	
										
										res.status(200).json({full_list:results,recent_list:results2});
									}
									
								});
								
								
							}
							
						});
						
					
					}
			});
		});
	});
	
	
	//Sending Activity Log
	app.post('/api/getActivity', function(req,res) {
		
		console.log('ACTIVITY : ' + req.body.username);
		
		var username = req.body.username;
		var ActList="SELECT * FROM user_activity WHERE username='"+ username +"' ORDER BY activity_id DESC LIMIT 10";
				
		pool.getConnection(function(error,connection){	
			connection.query(ActList, function(err , results){
				
				if (err) 
				{
					connection.release();
					res.status(400);
				}	
				else
				{
					connection.release();
					res.status(200).json({list:results});
				}
				
			});
		});
		
	});
	
	//Updating User Profile
	app.post('/api/setProfile', function(req,res) {
		
		console.log('EDIT PROFILE : ' + req.body.username);

		
		var username = req.body.username;
		var bio = req.body.bio;
		var work = req.body.work;
		var education = req.body.education;
		var mobile = req.body.mobile;
		var interest = req.body.interest;
		var InsProfile= "UPDATE users SET bio='" + bio + "', work='" + work + "', education='" + education + "', mobile='" + mobile + "', interests='" + interest + "' WHERE username ='" + username + "'";
		console.log(InsProfile)
				
		pool.getConnection(function(error,connection){
			connection.query(InsProfile, function(err , results){
				
				if (err) 
				{
					connection.release();
					res.status(400);
				}	
				else
				{
					connection.release();
					res.status(200).json({status:true});
				}
				
			});
		});
		
	});
	
	//Setting User Profile
	app.post('/api/getProfile', function(req,res) {
		
		var username = req.body.username;
		console.log('SEND PROFILE : ' + req.body.username);

		var GetProfile= "SELECT * from users WHERE username='"+username+"'";
		console.log(GetProfile)
				
		pool.getConnection(function(error,connection){
			connection.query(GetProfile, function(err , results){
				
				if (err) 
				{
					connection.release();
					res.status(400);
				}	
				else
				{
					connection.release();
					res.status(200).json({user_details:results[0]});
				}
				
			});
		});
		
	});




};


