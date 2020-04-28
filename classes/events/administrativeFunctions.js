module.exports = function(io, context){
    io.sockets.on('connection', function(socket){
        socket.on('playRandomCard', () => {
            var randomPlayedPolicy = context.game.playRandomPolicy();

            console.log('Random policy removed: ' + randomPlayedPolicy);

            console.log('There are ' + context.game.policiesNotDrawn.length + ' policies not drawn');
            if(context.game.policiesNotDrawn.length < 3){
                io.emit('messageGeneral', 'Le deck a été brassé!');
                context.game.shuffleDeck();
            }

            for(var i = 0; i < context.players.length; i++){
                var player = context.players[i];

                io.emit('democrativeSessionEnd', {
                    destination: player.id,
                    playedPolicy: randomPlayedPolicy
                });

                context.game.resetTurn();
            }
        });
    });
}



