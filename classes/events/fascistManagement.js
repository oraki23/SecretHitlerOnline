var facistRoleReveal = function(players, io){
    var facistPlayers = players.filter(pl => pl.role === 'Facist');
    var hitlerPlayer = players.find(pl => pl.role === 'Hitler');
    for(var i = 0; i < facistPlayers.length; i++){
        var player = facistPlayers[i];
        io.to(player.id).emit('hitlerRevealed', {
            value: hitlerPlayer.name
        });
    }

    if(players.length < 7){
        var facistPlayer = players.find(pl => pl.role == 'Facist');
        var hitlerPlayer = players.find(pl => pl.role == 'Hitler');
        io.to(hitlerPlayer.id).emit('hitlerRevealed', {
            value: facistPlayer.name
        });
    }
}

module.exports = facistRoleReveal;