var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var setFiles = require('./services/setFiles');
var signUp = require('./services/signUp');
var getStar = require('./services/getStar');
var star = require('./services/star');
var unstar = require('./services/unstar');
var deleteFile = require('./services/deleteFile');
var getActivity = require('./services/getActivity');
var getProfile = require('./services/getProfile');




var topic_name = 'request_topic';
var consumer = connection.getConsumer(topic_name);
var producer = connection.getProducer();

console.log('server is running');
consumer.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log('TOPIC IDENTIFY' + data.data.topic)
    
    if(data.data.topic==="login"){
    	
    
	    login.handle_request(data.data, function(err,res){
	        console.log('after handle'+res);
	        var payloads = [
	            { topic: data.replyTo,
	                messages:JSON.stringify({
	                    correlationId:data.correlationId,
	                    data : res
	                }),
	                partition : 0
	            }
	        ];
	        producer.send(payloads, function(err, data){
	            console.log(data);
	        });
	        return;
	    });
	}
    
    if(data.data.topic==="setFiles"){
    	
        
	    setFiles.handle_request(data.data, function(err,res){
	        console.log('after handle'+res);
	        var payloads = [
	            { topic: data.replyTo,
	                messages:JSON.stringify({
	                    correlationId:data.correlationId,
	                    data : res
	                }),
	                partition : 0
	            }
	        ];
	        producer.send(payloads, function(err, data){
	            console.log(data);
	        });
	        return;
	    });
	}
    
    if(data.data.topic==="signUp"){
    	
        
	    signUp.handle_request(data.data, function(err,res){
	        console.log('after handle'+res);
	        var payloads = [
	            { topic: data.replyTo,
	                messages:JSON.stringify({
	                    correlationId:data.correlationId,
	                    data : res
	                }),
	                partition : 0
	            }
	        ];
	        producer.send(payloads, function(err, data){
	            console.log(data);
	        });
	        return;
	    });
	}
    
    if(data.data.topic==="getStar"){
    	
        
	    getStar.handle_request(data.data, function(err,res){
	        console.log('after handle'+res);
	        var payloads = [
	            { topic: data.replyTo,
	                messages:JSON.stringify({
	                    correlationId:data.correlationId,
	                    data : res
	                }),
	                partition : 0
	            }
	        ];
	        producer.send(payloads, function(err, data){
	            console.log(data);
	        });
	        return;
	    });
	}
    
    if(data.data.topic==="star"){
    	
        
	    star.handle_request(data.data, function(err,res){
	        console.log('after handle'+res);
	        var payloads = [
	            { topic: data.replyTo,
	                messages:JSON.stringify({
	                    correlationId:data.correlationId,
	                    data : res
	                }),
	                partition : 0
	            }
	        ];
	        producer.send(payloads, function(err, data){
	            console.log(data);
	        });
	        return;
	    });
	}
    
    if(data.data.topic==="unstar"){
    	
        
	    unstar.handle_request(data.data, function(err,res){
	        console.log('after handle'+res);
	        var payloads = [
	            { topic: data.replyTo,
	                messages:JSON.stringify({
	                    correlationId:data.correlationId,
	                    data : res
	                }),
	                partition : 0
	            }
	        ];
	        producer.send(payloads, function(err, data){
	            console.log(data);
	        });
	        return;
	    });
	}
    
    if(data.data.topic==="deleteFile"){
    	
        
    	deleteFile.handle_request(data.data, function(err,res){
	        console.log('after handle'+res);
	        var payloads = [
	            { topic: data.replyTo,
	                messages:JSON.stringify({
	                    correlationId:data.correlationId,
	                    data : res
	                }),
	                partition : 0
	            }
	        ];
	        producer.send(payloads, function(err, data){
	            console.log(data);
	        });
	        return;
	    });
	}
    
    if(data.data.topic==="getActivity"){
    	
        
    	getActivity.handle_request(data.data, function(err,res){
	        console.log('after handle'+res);
	        var payloads = [
	            { topic: data.replyTo,
	                messages:JSON.stringify({
	                    correlationId:data.correlationId,
	                    data : res
	                }),
	                partition : 0
	            }
	        ];
	        producer.send(payloads, function(err, data){
	            console.log(data);
	        });
	        return;
	    });
	}
	
	if(data.data.topic==="getProfile"){
    	
        
		getProfile.handle_request(data.data, function(err,res){
	        console.log('after handle'+res);
	        var payloads = [
	            { topic: data.replyTo,
	                messages:JSON.stringify({
	                    correlationId:data.correlationId,
	                    data : res
	                }),
	                partition : 0
	            }
	        ];
	        producer.send(payloads, function(err, data){
	            console.log(data);
	        });
	        return;
	    });
	}
    
    
});