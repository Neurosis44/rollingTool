var userList = [];

var http = require('http'),
    fs = require('fs');
 
var app = http.createServer(function (request, response) {
    fs.readFile("client.html", 'utf-8', function (error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
}).listen(1337);
 
var io = require('socket.io').listen(app);
 
io.sockets.on('connection', function(socket) {
    // Appelé lors d'un jet de dés, retourne le message affiché dans le tchat
    socket.on('roll', function(data) {
        console.log('roooooll');
        var jet = roll(data.competenceValue, data.competence, data.bonusMalus, socket.userName);
        io.sockets.in(socket.room).emit("roll",{ message: jet });
    });
    // Appelé lors de la connexion d'un nouvel utilisateur
    socket.on('newUser', function(data) {
        console.log(data.userName+" joined "+data.room);
        
        socket.userName = data.userName;
        socket.room = data.room;
        
        if(!userList[data.room]){
            userList[data.room] = [];
        } 
        userList[socket.room].push(data.userName);
        
        socket.join(socket.room);
        io.sockets.in(socket.room).emit("refreshUsers",{ userList: userList[socket.room] });
        
    });
    // Appelé lors d'une déconnexion
    socket.on('disconnect', function(data) {
        console.log('disconnection');
        /*for(var i=0; i < userList[socket.room].length; i++){
            if(userList[socket.room][i] == socket.userName) userList[socket.room].remove(i);
        }*/
        if(userList[socket.room].length > 0)
            userList[socket.room].splice(userList[socket.room].indexOf(socket.userName),1);
        io.sockets.in(socket.room).emit("refreshUsers",{ userList: userList[socket.room] });
    });
});

// Traitement du jet de dés, calcul du message à émettre aux tchats
function roll(compValue, comp, bonusMalus, pseudo){
    var rand = Math.floor(Math.random() * 100) + 1;
    var totalValue = parseInt(compValue) + parseInt(bonusMalus);
    
    var msg = "<b>"+pseudo+"</b> a";
    if(rand <= totalValue){
        msg += " <b style='color:green'> réussi</b>";
    }
    else {
        msg += " <b style='color:red'> raté</b>";
    }
    
    msg += " son jet de <b>"+comp+"</b>";
    msg += " <i>("+rand+" sur "+totalValue+")</i>";
    if(bonusMalus > 0)
        msg += " <i>(bonus +"+bonusMalus+")</i>";
    else if(bonusMalus < 0)
        msg += " <i>(malus "+bonusMalus+")</i>";
    return msg;
}