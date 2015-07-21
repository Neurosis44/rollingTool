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
        var jet = roll(socket.stats[data.competence], data.competence, data.bonusMalus, socket.userName);
        io.sockets.in(socket.room).emit("roll",{ message: jet });
    });
    
    // Appelé lors de la connexion d'un nouvel utilisateur
    socket.on('newUser', function(data) {
        console.log(data.userName+" joined "+data.room+" ("+data.role+")");
        
        socket.userName = data.userName;
        socket.room = data.room;
        socket.pnjNumber = 0;
        console.log(data.stats);
        socket.stats = data.stats;
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
        io.sockets.in(socket.room).emit("removePlayerOnScene", { pionId: socket.userName });
        if(userList[socket.room] && userList[socket.room].length > 0)
            userList[socket.room].splice(userList[socket.room].indexOf(socket.userName),1);
        io.sockets.in(socket.room).emit("refreshUsers",{ userList: userList[socket.room] });
    });
    
     // Appelé lors d'une déconnexion
    socket.on('user image', function(data) {
        console.log("image sended.")        
        io.sockets.in(socket.room).emit('user image', { fileData: data });
        
    });
    
    // Appelé lors de l'ajout d'un joueur sur la scène
    socket.on('addPlayerOnScene', function(data) {
        io.sockets.in(socket.room).emit("addPlayerOnScene", { pionId: socket.userName, color : data.color });
    });
    
    // Appelé lors de l'ajout d'un PNJ sur la scène
    socket.on('addPNJOnScene', function(data) {
        socket.pnjNumber++;
        var pnjName = "";
        if(data.pnjName == "") pnjName = socket.pnjNumber;
        else pnjName = data.pnjName+" - "+socket.pnjNumber;
        io.sockets.in(socket.room).emit("addPlayerOnScene", { pionId: pnjName, color : data.color, x : data.x, y : data.y });
    });
    
    // Appelé lors d'un remove du joueur de la map
    socket.on('removePlayerOnScene', function(data) {
        if(data && data.pionId) {
            io.sockets.in(socket.room).emit("removePlayerOnScene", { pionId: data.pionId });
        } else {
            io.sockets.in(socket.room).emit("removePlayerOnScene", { pionId: socket.userName });
        }
    });
    
     // Appelé lorsdu mouvement d'un pion sur le plateau
    socket.on('updatePlayerPosition', function(data) {
        //io.sockets.in(socket.room).emit("updatePlayerPosition", { pionId : data.pionId, x: data.x, y: data.y });
        socket.to(socket.room).emit("updatePlayerPosition", { pionId : data.pionId, x: data.x, y: data.y });
    });
    
});

// Traitement du jet de dés, calcul du message à émettre aux tchats
function roll(compValue, comp, bonusMalus, pseudo){
    console.log('compValue :'+compValue)
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

function findClientsSocket(roomId, namespace) {
    var res = []
    , ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId) ;
                if(index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}