const playerStatus = require('./playerStatus');

module.exports = class Context{
    constructor(){
        this.players = [];
        this.game = null;
    }

    addPlayer(player){
        this.players.push(player);
    }

    removePlayer(socketId){
        this.players = this.players.filter(player => player.id !== socketId);
    }

    findPlayerById(socketId){
        return this.players.find(player => player.id === socketId);
    }

    removeDisconnectedPlayers(){
        for(var i = 0; i < this.players.length; i++){
            var player = this.players[i];
            if(player.status != playerStatus.CONNECTED){
                this.removePlayer(player.id);
                i--;
            }
        }
    }

    gameIsStarted(){
        return this.game != null;
    }

    playersPublishable(){
        var toReturn = [];
        for(var i = 0; i < this.players.length; i++){
            toReturn.push(this.players[i].playerPublishable());
        }
        return toReturn;
    }
}