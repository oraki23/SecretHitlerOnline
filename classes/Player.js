module.exports = class Player{
    constructor(id, name, ip){
        this.id = id;
        this.name = name;
        this.ip = ip;
        this.role = '';
    }

    giveRole(role){
        this.role = role;
    }
}