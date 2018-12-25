var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {

        var from = 'Irina';
        var text = 'this is test';
        var message = generateMessage(from, text);

        expect(message.from).toEqual(from);
        expect(message.text).toEqual(text);
        expect(message.createdAt).toBeTruthy();

    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = 'Test user';
        var latitude = 10;
        var longitude = 20;
        var locationTest = generateLocationMessage(from, latitude, longitude);

        expect(locationTest.from).toEqual(from);
        expect(locationTest.createdAt).toBeTruthy();
        expect(locationTest.url).toEqual('https://www.google.com/maps?q=10,20');
    });
});