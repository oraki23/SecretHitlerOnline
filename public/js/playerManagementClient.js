$(document).ready(function() {
    //Client initiating connection
    $('#connectButton').on('click', function(){
        if(localStorage.getItem('userUniqueId') == null){
            var randomlyGeneratedUID = Math.random().toString(36).substring(3,16) + +new Date;
            localStorage.setItem('userUniqueId', randomlyGeneratedUID);
        }

        var username = $('#username').val();
        myUsername = username;
        socket.emit('newPlayerConnected', {
            username: username,
            browserId: localStorage.getItem('userUniqueId')
        });
        myUsername = username;
    });

    socket.on('connectionSuccessful', function () {
        $('#connectDiv').hide();
        $('#startGame').show();
    })

    //Receiving connections
    socket.on('reconnectionCompleted', function(informations){
        $('#roleName').text(informations.roleName);

        drawBoard(informations.nbOfPlayers, informations.nbOfFacistCards, informations.nbOfLiberalCards);

        $('#connectDiv').hide();
        $('#startGame').hide();
        $('#playDiv').show();
    });
});