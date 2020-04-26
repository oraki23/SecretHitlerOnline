const Player = require('../Player.js');
const playerStatus = require('../playerStatus');

module.exports = function(io, context){
    io.sockets.on('connection', function(socket){
        socket.on('newPlayerConnected', (connectinfo) => {     
            //Add user if he is not already connected
            if(context.players.some(player => player.id == socket.id)){
                io.emit('customError', {
                    destination : socket.id,
                    message: 'Vous êtes déjà connecté!'
                });
            } else if(context.players.some(player => (player.name == connectinfo.username && player.browserId != connectinfo.browserId))){
                io.emit('customError', {
                    destination : socket.id,
                    message: 'Ce nom est déjà utilisé!'
                });
            } else{
                //If the player tries to connect with username and same browserId,
                //This means that it is a reconnect attempt.
                //In case that the timeout would have expired, the player would not even exist anymore.
                if(context.players.some(player => (player.name == connectinfo.username && player.browserId == connectinfo.browserId))){
                    var playerToReconnectIndex = context.players.findIndex(pl => (pl.name == connectinfo.username && pl.browserId == connectinfo.browserId));
                    context.players[playerToReconnectIndex].setId(socket.id);
                    context.players[playerToReconnectIndex].setStatus(playerStatus.CONNECTED);
                    
                    //Return the card and the roleName
                    var player = context.players[playerToReconnectIndex];
                    io.to(socket.id).emit('reconnectionCompleted', {
                        roleName: player.role,
                        cardPlayed: context.game.policiesPlayed
                    });
                    //Return if the president and chancelor were choosen
                    if(context.game.isPresidentChoosen()){        
                        var presidentId = context.players.findIndex(pl => pl.name == context.game.president);
                        var president = context.players[presidentId];   

                        io.to(socket.id).emit('presidentChoosen', president.name);

                    } else if(context.game.isChancelorChoosen()){
                        var chancelorId = context.players.findIndex(pl => pl.name == context.game.chancelor);
                        var chancelor = context.players[chancelorId];

                        io.to(socket.id).emit('chancelorChoosen', chancelor.name);
                    }
                } else {
                    var player = new Player(socket.id, connectinfo.browserId, connectinfo.username);
                    context.addPlayer(player);    
                }

                io.emit('playerListModification', context.playersPublishable());
                io.emit('playerRelatedAnnouncement', 'Un nouveau joueur a joint: ' + connectinfo.username);
            }
        });

        socket.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
            // the disconnection was initiated by the server, you need to reconnect manually
            socket.connect();
            }
            var playerDisconnected = context.findPlayerById(socket.id);
            //If game is not started, the player will be removed.
            //If the game has started, he will simply be set with a status DISCONNECTED
            if(!context.gameIsStarted()){
                context.removePlayer(socket.id);
            } else {
                playerDisconnected.status = playerStatus.DISCONNECTED;
            }
            if(playerDisconnected != null){
                io.emit('playerListModification', context.playersPublishable());
                io.emit('playerRelatedAnnouncement', 'Un joueur a quitté: ' + playerDisconnected.name);
            }
        });
    });
}