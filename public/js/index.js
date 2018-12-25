$(document).ready(function() {

    var socket = io();

    socket.on('connect', function () {
        
        socket.on('updateRoomList', function (rooms) {

            rooms.forEach(function (room) {
                $('#active__rooms').append(`<option value="${room}"`);
            });
        });
    });
    socket.on('disconnect', function() {
        console.log('Disconnected from server.');
    });
})

