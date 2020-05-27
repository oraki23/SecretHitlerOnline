$(document).ready(function() {
    //Administrative functions
    $('#playRandomCard').on('click', function(){
        socket.emit('playRandomCard');
    });
    $('#playLiberal').on('click', function(){

    });
    $('#playFacist').on('click', function(){

    });
    $('#resetTurn').on('click', function(){
        socket.emit('resetTurn');
    });
    $('#resetGame').on('click', function(){
        socket.emit('resetGame');
    });

    //Reset Turn received Event
    socket.on('resetTurnNotification', function(data){

        $('#playDiv').show();

        $('#IAmPresident').show();
        $('#IAmChancelor').show();
        $('#cardView').hide();
        $('#cardView').html('');
        $('#waiting').hide();

        $('#powerupShowTopThreeCards').hide();

    });

    //Reset game received Event
    socket.on('resetGameNotification', function(data){
        if(data.isConnected){
            $('#connectDiv').hide();
            $('#startGame').show();
        } else{
            $('#connectDiv').show();
            $('#startGame').hide();
        }

        $('#playDiv').hide();
        $('#hitlerRevealName').hide();

        $('#IAmPresident').show();
        $('#IAmChancelor').show();
        $('#cardView').hide();
        $('#cardView').html('');
        $('#waiting').hide();

        $('#roleName').text('------');

        $('#liberalBoard').attr('src', 'img/boardLiberal/boardLiberal-0.png');
        $('#facistBoard').attr('src', 'img/boardFacist5-6p/boardFacist5-6p-0.png');

        $('#powerupShowTopThreeCards').hide();

    });
});
