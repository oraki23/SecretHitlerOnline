
const Player = require('./classes/Player.js');
const Context = require('./classes/Context.js');
const Game = require('./classes/Game.js');

const path = require('path');
const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var context = new Context();

const playerManagement = require('./classes/events/playerManagement.js')(io, context);
const administrativeFunctions = require('./classes/events/administrativeFunctions.js')(io, context);
const democrativeSessionLib = require('./classes/events/democrativeSession.js');

const democrativeSession1Functions = democrativeSessionLib.democrativeSession1Launch(io, context);
const democrativeSession2Functions = democrativeSessionLib.democrativeSession2Launch(io, context);
const democrativeSessionEnd = democrativeSessionLib.democrativeSessionEnd(io, context);


const powerupsLib = require('./classes/events/powerups.js');

const powerupShowTopThreeCards = powerupsLib.showTopThreeCards(io, context);

const facistManagement = require('./classes/events/fascistManagement.js');

app.use(express.static('public'));
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', (socket) => {
    //Flow Normal
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
                io.to(player.id).emit('cardGiving', {
                    value: player.role,
                    nbOfPlayers: context.game.numberOfPlayers
                });
            }

            facistManagement(context.players, io);
        }
    });

});

http.listen(8000, () => {
    console.log('App running on port 8000');
})
