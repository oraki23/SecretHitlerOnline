$(document).ready(function() {
    $('#showTopThreeCards').on('click', function(){
        console.log('In button event');
        socket.emit('showTopThreeCards', mySocketId);
    });

    socket.on('ShowTopThreeCardsPowerAllowed', () => {
        //Show the powerup button
        $('#powerupShowTopThreeCards').show();
    });

    socket.on('showTopThreeCardsResponse', function (values) {
        alert('Voici les 3 cartes du dessus du paquet: ' + values[0] + ' | ' + values[1] + ' | ' + values[2]);

        $('#powerupShowTopThreeCards').hide();
    });

});
