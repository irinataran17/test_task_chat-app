$(document).ready(function() {

    var socket = io();
    var select = $('#rooms-select');

    socket.on('UpdateRoomList', (rooms) => {
        if (!rooms.length > 0) {
            select.append( `<option value="" selected disabled hidden> -- No Activ Room -- </option>` )
        }
        rooms.forEach((room) => {
            select.append( `<option value="${room}">${room}</option>` )
        });
    });
    
    $('#rooms-select').click((e) => {
        $('#room-name').val(e.target.value)
    });
});

