const Player = require('./classes/Player.js');
const Context = require('./classes/Context.js');
const Game = require('./classes/Game.js');

const path = require('path');
const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.use(express.static('public'));
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});


var context = new Context();

io.on('connection', (socket) => {
    console.log('a user connected! ' + socket.id);
    socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
            // the disconnection was initiated by the server, you need to reconnect manually
            socket.connect();
          }
        console.log('a user disconnected! ' + socket.id);
        context.removePlayer(socket.id);
    });
    socket.on('reconnect', (attemptNumber) => {
        console.log(socket.id);
    });

    //Flow Normal
    socket.on('newPlayer', (connectinfo) => {
        console.log('userid: ' + socket.id);

        //Add user if he is not already connected
        if(context.players.some(player => player.id == socket.id)){
            io.emit('customError', {
                destination : socket.id,
                message: 'Vous êtes déjà connecté!'
            });
        } else if(context.players.some(player => player.name == connectinfo.username)){
            io.emit('customError', {
                destination : socket.id,
                message: 'Ce nom est déjà utilisé!'
            });
        } else{
            var player = new Player(socket.id, connectinfo.username);
            context.addPlayer(player);
            io.emit('newPlayerAnnouncement', 'Un nouveau joueur a joint: ' + connectinfo.username);
        }
    });

    socket.on('startGame', (userId) => {
        console.log('Starting Game');
        var playerNumber = context.players.length;
        if(playerNumber < 5 || playerNumber > 10){
            io.emit('customError', {
                destination : socket.id,
                message: 'Pas assez de joueur pour débuter la partie!!'
            });
        } else{
            context.game = new Game(playerNumber);

            //Give to each player their cards
            for(var i = 0; i < context.players.length; i++){
                var player = context.players[i];
                player.giveRole(context.game.cards.pop());
                io.emit('cardGiving', {
                    destination : player.id,
                    value: player.role,
                });
            }

            var facistPlayers = context.players.filter(pl => pl.role == 'Facist');
            console.log(facistPlayers);
            var hitlerPlayerId = context.players.findIndex(pl => pl.role == 'Hitler');
            var hitlerPlayer = context.players[hitlerPlayerId];
            console.log(hitlerPlayer);
            for(var i = 0; i < facistPlayers.length; i++){
                var player = facistPlayers[i];
                console.log(player);
                io.emit('hitlerRevealed', {
                    destination : player.id,
                    value: hitlerPlayer.name
                });
            }

            if(context.game.numberOfPlayers < 7){
                var facistPlayerId = context.players.findIndex(pl => pl.role == 'Facist');
                var hitlerPlayerId = context.players.findIndex(pl => pl.role == 'Hitler');
                var facistPlayer = context.players[facistPlayerId];
                var hitlerPlayer = context.players[hitlerPlayerId];
                io.emit('hitlerRevealed', {
                    destination : hitlerPlayer.id,
                    value: facistPlayer.name
                });
            }
        } 
    });

    socket.on('IAmPresident', (userId) => {
        context.game.president = userId;
        
        var presidentId = context.players.findIndex(pl => pl.id == userId);
        var president = context.players[presidentId];

        console.log('Le président est: ' + president.name);

        io.emit('presidentChoosen', president.name);

        if(context.game.isPresidentChoosen() && context.game.isChancelorChoosen()){
            console.log('Democrative session started (from IAmPresident)');
            context.game.drawThreePolicy();
            console.log('Start of game, the 3 policies are: ' + context.game.policiesInHand);
            for(var i = 0; i < context.players.length; i++){
                var player = context.players[i];
                var role = 0;
                if(player.id == context.game.president){
                    console.log('President assigned!');
                    role = 1;
                } else if (player.id == context.game.chancelor){
                    console.log('Chancelor assigned!');
                    role = 2;
                }

                var policies = context.game.policiesInHand;
                io.emit('democrativeSessionPart1', {
                    destination: player.id,
                    role: role,
                    policies: policies
                });
            }
        }
    });
    socket.on('IAmChancelor', (userId) => {
        context.game.chancelor = userId;

        var chancelorId = context.players.findIndex(pl => pl.id == userId);
        var chancelor = context.players[chancelorId];

        console.log('Le chancelier est: ' + chancelor.name);

        io.emit('chancelorChoosen', chancelor.name);

        if(context.game.isPresidentChoosen() && context.game.isChancelorChoosen()){
            console.log('Democrative session started (from IAmChancelor)');
            context.game.drawThreePolicy();
            console.log('Start of game, the 3 policies are: ' + context.game.policiesInHand);
            for(var i = 0; i < context.players.length; i++){
                var player = context.players[i];
                var role = 0;
                if(player.id == context.game.president){
                    console.log('President assigned!');
                    role = 1;
                } else if (player.id == context.game.chancelor){
                    console.log('Chancelor assigned!');
                    role = 2;
                }

                var policies = context.game.policiesInHand;
                io.emit('democrativeSessionPart1', {
                    destination: player.id,
                    role: role,
                    policies: policies
                });
            }
        }
    });

    socket.on('policyChoosenPart1', (choosenPolicy) => {
        //TODO: Remove one policy from the In Hand ones
        console.log('Choosen Policy : ' + choosenPolicy);
        context.game.putPolicyBack(choosenPolicy);

        console.log('President has played, the 2 policies left are: ' + context.game.policiesInHand);
        for(var i = 0; i < context.players.length; i++){
            var player = context.players[i];
            var role = 0;
            if(player.id == context.game.president){
                role = 1;
            } else if (player.id == context.game.chancelor){
                role = 2;
            }

            var policies = context.game.policiesInHand;
            io.emit('democrativeSessionPart2', {
                destination: player.id,
                role: role,
                policies: policies
            });
        }
    });

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
            if(player.id == context.game.president){
                role = 1;
            } else if (player.id == context.game.chancelor){
                role = 2;
            }

            io.emit('democrativeSessionEnd', {
                destination: player.id,
                role: role,
                playedPolicy: playedPolicy
            });

            context.game.resetTurn();
        }
    });

    //Administrative Controls
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

http.listen(8000, () => {
    console.log('App running on port 8000');
})