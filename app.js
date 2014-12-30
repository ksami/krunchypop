/*
 * Server-side JS - Main file
 */

// Environment configurables
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var _fileindex = __dirname + '/public/index.html';

// Dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
app.use(express.static(__dirname + '/public'));
var MongoClient = require('mongodb').MongoClient;

// Connection URL for db
var nameofdb = 'local';
var url = 'mongodb://localhost:27017/' + nameofdb;
var _db;


// Globals

// Listen to <port>
http.listen(port, ipaddress, function(){
    console.log('listening on ' + ipaddress + ':' + port);
});

// Route handler
app.get('/',function(req, res){
    res.sendfile(_fileindex);
});


//=========
// Session
//=========
io.on('connection', function(socket){

    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log(err);
        }
        console.log("Connected to server");
        _db = db;
    });

    // When user first connects
    socket.join(socket.id);
    console.log('user ' + socket.id + ' connected');
    io.to(socket.id).emit('socketid', socket.id);


    //==============================================
    // Event handlers for events triggered by client
    //==============================================

    // Save user data on disconnect
    socket.on('dc', function() {
        console.log('user ' + socket.id + ' disconnected');
        _db.close();
    });

    // Any other input, echo back
    socket.on('command', function(msg){
        console.log('user ' + socket.id + ' sent:');
        console.dir(msg);
        
        if(msg.username == "read"){
            readDocuments(_db, function(){
                console.log("read done");
            });
        }
        else{
            insertDocuments(_db, msg, function(){
                console.log("insert done");
            });
        }
    });

});

var readDocuments = function(db, callback) {
    var collection = db.collection('testData');
    result = collection.find();
    console.dir(result);
    callback(result);
};

var insertDocuments = function(db, data, callback) {
    var collection=db.collection('testData');
    collection.insert(data, function(err, result){
        if(err){
            console.log(err);
        }
        console.log("inserted successfully");
        console.dir(result);
        callback(result);
    });
};
