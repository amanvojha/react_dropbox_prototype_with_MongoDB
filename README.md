A dropbox prototype build with the following:

React and Redux for front-end
Node/Express for the backend
MongoDb for database 
* Kafka as a messaging queue



Go to all the folders and run command "npm install".

To run the Project

Goto dropbox_client folder and run "npm start".
Goto dropbox_server folder and run "nodemon App.js".
Goto kafka_back-end folder and run "nodemon server.js".

KAFKA

Goto Kafka Folder
* Start Zookepper Server 
cd bin/windows 
zookeeper-server-start.bat ../../config/zookeeper.properties

* Start Kafka Server 
kafka-server-start.bat ../../config/server.properties

* Create 2 topics 
kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic request_topic

kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic response_topic