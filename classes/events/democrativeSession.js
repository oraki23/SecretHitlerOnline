var startDemocrativeSession1 = function(game, players, io){
    console.log('Democrative session started');
    game.drawThreePolicy();
    console.log('Start of game, the 3 policies are: ' + game.policiesInHand);
    for(var i = 0; i < players.length; i++){
        var player = players[i];
        notifyPlayerOfDemocrativeSession1Started(game, player, io);
    }
}

var notifyPlayerOfDemocrativeSession1Started = function(game, player, io){
    var role = 0;

    if(player.name == game.president){
        console.log('President assigned!');
        role = 1;
    } else if (player.name == game.chancelor){
        console.log('Chancelor assigned!');
        role = 2;
    }

    var policies = game.policiesInHand;
    io.to(player.id).emit('democrativeSessionPart1', {
        role: role,
        policies: policies
    });
}

var democrativeSession1Launch = function(io, context){
    io.sockets.on('connection', function(socket){
        socket.on('IAmPresident', (username) => {
            context.game.president = username;

            var presidentId = context.players.findIndex(pl => pl.name == username);
            var president = context.players[presidentId];

            console.log('Le président est: ' + president.name);

            io.emit('presidentChoosen', president.name);

            if(context.game.isPresidentChoosen() && context.game.isChancelorChoosen()){
                startDemocrativeSession1(context.game, context.players, io);
            }
        });
        socket.on('IAmChancelor', (username) => {
            context.game.chancelor = username;

            var chancelorId = context.players.findIndex(pl => pl.name == username);
            var chancelor = context.players[chancelorId];

            console.log('Le chancelier est: ' + chancelor.name);

            io.emit('chancelorChoosen', chancelor.name);

            if(context.game.isPresidentChoosen() && context.game.isChancelorChoosen()){
                startDemocrativeSession1(context.game, context.players, io);
            }
        });
    });
}

//Session 2
var notifyPlayerOfDemocrativeSession2Started = function(game, player, io){
    var role = 0;
    if(player.name == game.president){
        role = 1;
    } else if (player.name == game.chancelor){
        role = 2;
    }

    var policies = game.policiesInHand;
    io.to(player.id).emit('democrativeSessionPart2', {
        role: role,
        policies: policies
    });
}

var democrativeSession2Launch = function(io, context){
    io.sockets.on('connection', function(socket){
        socket.on('policyChoosenPart1', (choosenPolicy) => {
            context.game.putPolicyBack(choosenPolicy);

            console.log('President has played, the 2 policies left are: ' + context.game.policiesInHand);
            for(var i = 0; i < context.players.length; i++){
                var player = context.players[i];
                notifyPlayerOfDemocrativeSession2Started(context.game, player, io);
            }
        });
    });
}

var democrativeSessionEnd = function(io, context){
    io.sockets.on('connection', function(socket) {
        socket.on('policyChoosenPart2', (choosenPolicy) => {
            context.game.putPolicyBack(choosenPolicy);
            var playedPolicy = context.game.policiesInHand[0];
            context.game.playPolicy(playedPolicy);

            console.log('Chancelor has played, the removed is: ' + choosenPolicy);
            console.log('The played one is: ' + playedPolicy);

            console.log('There are ' + context.game.policiesNotDrawn.length + ' policies not drawn');
            if(context.game.policiesNotDrawn.length < 3){
                io.emit('messageGeneral', 'Le deck a été brassé!');

                context.game.shuffleDeck();
            }

            for(var i = 0; i < context.players.length; i++){
                var player = context.players[i];
                var role = 0;
                if(player.name == context.game.president){
                    role = 1;
                } else if (player.name == context.game.chancelor){
                    role = 2;
                }

                io.to(player.id).emit('democrativeSessionEnd', {
                    role: role,
                    playedPolicy: playedPolicy,
                    nbOfFacistCards: context.game.getNumberOfFacistPlayed(),
                    nbOfLiberalCards: context.game.getNumberOfLiberalPlayed(),
                    nbOfPlayers: context.game.numberOfPlayers
                });

                //IF, we are 5-6 players, and I am the lastest president, and the card just played was facist and that there are now 3 facists policies on the table
                //(Rule)
                if((context.game.numberOfPlayers == 5 || context.game.numberOfPlayers == 6) &&
                    role == 1 &&
                    playedPolicy === 'Facist' &&
                    context.game.getNumberOfFacistPlayed() === 3){
                    io.to(player.id).emit('ShowTopThreeCardsPowerAllowed');
                }
                context.game.resetTurn();
            }
        });
    });
}


module.exports = {
    notifyPlayerOfDemocrativeSession1Started: notifyPlayerOfDemocrativeSession1Started,
    notifyPlayerOfDemocrativeSession2Started: notifyPlayerOfDemocrativeSession2Started,
    democrativeSession1Launch: democrativeSession1Launch,
    democrativeSession2Launch: democrativeSession2Launch,
    democrativeSessionEnd: democrativeSessionEnd
};
