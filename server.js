var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1337;

var userList = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    
    // Initial connection
    var handshakeData = socket.request;
    var userName = handshakeData._query['UserName'];
    var user = {
        ID: socket.id,
        UserName: userName
    };

    userList.push(user);
    io.emit('updateUserList', userList);
    io.emit('join', userName);
    
    socket.on('disconnect', function () {
        console.log('user disconnected');
        
        var elementPos = userList.map(function (x) { return x.ID; }).indexOf(socket.id);
        userList.splice(elementPos, 1);
        
        io.emit('updateUserList', userList);
        io.emit('leave', userName);
    });
    
    socket.on('chat message', function (msg) {
        //console.log(msg);
        io.emit('chat message', msg);
    });

});


http.listen(port, function () {
    console.log('listening on *:' + port);
});