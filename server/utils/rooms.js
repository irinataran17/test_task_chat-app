class Rooms {
    constructor () {
        this.rooms = [];
    }
    addRoom(room) {
        var isRoom = this.rooms.filter((r) => r === room);
        if (isRoom.length === 1) {
            return;
        } else {
            this.rooms.push(room);
        }
    }
    removeRoom(room, users) {
        var removedRoom = this.rooms.filter(r => r === room)[0];
        if (removedRoom) {
            if (users) {
                return;
            } else {
                this.rooms = this.rooms.filter((room) => room !== removedRoom);
            }
        }
    }
    getRoomList() {
        return this.rooms;
    }
}

module.exports = {Rooms};