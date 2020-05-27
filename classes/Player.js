const playerStatus = require('./playerStatus');

module.exports = class Player{
    constructor(id, browserId, name){
        this.id = id;
        this.browserId = browserId;
        this.name = name;
        this.status = playerStatus.CONNECTED;
        this.role = '';
    }

    setId(id){
        this.id = id; 
    }

    setStatus(status){
        this.status = status;
    }

    playerPublishable(){
        return {
            name: this.name,
            status: this.status
        }
    }

    giveRole(role){
        this.role = role;
    }

    resetRole(){
        this.role = '';
    }
}