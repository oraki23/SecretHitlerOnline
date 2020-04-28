$(document).ready(function() {
    //Administrative functions
    $('#playRandomCard').on('click', function(){
        socket.emit('playRandomCard');
    });
    $('#playLiberal').on('click', function(){

    });
    $('#playFacist').on('click', function(){

    });
});