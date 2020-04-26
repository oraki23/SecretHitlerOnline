module.exports = class Context{
    constructor(){
        this.players = [];
        this.game = [];
    }

    addPlayer(player){
        this.players.push(player);
    }

    removePlayer(socketId){
        this.players = this.players.filter(player => player.id !== socketId);
    }
}