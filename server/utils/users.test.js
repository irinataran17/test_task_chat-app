const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Test room'
        }, {
            id: '2',
            name: 'Antony',
            room: 'Another room'
        }, {
            id: '3',
            name: 'Irina',
            room: 'Test room'
        }];
    });

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Irina',
            room: 'Some room name'
        };
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        var userId = '1';
        var user = users.removeUser(userId);
        expect(user.id).toBe(userId);
        expect(users.users).toHaveLength(2);
    });

    it('should not remove user id id doesnt exist', () => {
        var userId = '6';
        var user = users.removeUser(userId);
        expect(user).toBeFalsy();
        expect(users.users).toHaveLength(3);
    });

    it('should find user by id', () => {
        var userId = '2';
        var user = users.getUser(userId);
        expect(user.id).toBe(userId);
    });

    it('should not find user if id doesnt exist', () => {
        var userId = '6';
        var user = users.getUser(userId);
        expect(user).toBeFalsy();

    });

    it('should return names for test room', () => {
        var userList = users.getUserList('Test room');
        expect(userList).toEqual(['Mike', 'Irina']);
    });

    it('should return names for another room', () => {
        var userList = users.getUserList('Another room');
        expect(userList).toEqual(['Antony']);
    });
});
