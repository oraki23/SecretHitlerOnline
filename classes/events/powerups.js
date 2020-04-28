var showTopThreeCards = function(io, context){


    io.sockets.on('connection', function(socket){
        socket.on('showTopThreeCards', (socketId) => {
            var topThree = context.game.getThreeTopPolicyValues();

            io.to(socketId).emit('showTopThreeCardsResponse', topThree);
        });
    });
}


module.exports = {
    showTopThreeCards: showTopThreeCards
};