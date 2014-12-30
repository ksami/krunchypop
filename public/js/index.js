/*
 * Client-side JS
 */

var socket = io();
//if using websockets
//var socket = io.connect('http://muddy-ksami.rhcloud.com:8000');
var socketid;
var nick;

//==========================
// Trigger events on server
//==========================

// When user logs in
$('#login').submit(function(){
  var username = $('#username').val();
  var password = $('#password').val();
  $('#password').val('');
  
  socket.emit('command', {'username': username, 'password': password});

  return false;
});

$(window).on('beforeunload', function(){
  socket.emit('dc');
  console.log('dc');
});

//==============================================
// Event handlers for events triggered by server
//==============================================
socket.on('servershutdown' ,function(){
  alert('server restarting');
  document.location.href = '/';
});

socket.on('socketid', function(id){
  socketid = id;
});
