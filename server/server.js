const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {Rooms} = require('./utils/rooms');
const User = require('./models/user');
const {JWT_SECRET} = require('./secrets/secrets');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var rooms = new Rooms();


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());


app.post('/signup', (req, res) => {
    User.create({
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        token: jwt.sign({user: req.body.email}, JWT_SECRET)
    })
    .then(user => {
        var token = user.token;
        res.cookie('x-auth', token).header('x-auth', token).render('join', {message: 'You have been signed-up and logged in', name: user.name});
    })
    .catch(err => {
        res.status(400).render('signup', {message: `It's not you, something went wrong, please try again.`});
        console.log(err);
    });
});

app.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: {email: email}}).then(function (user) {
        if (!user) {
            res.status(400).render('index', {message: 'Email or password is incorrect, please try again.'});
        }
        var token = user.token;
        res.cookie('x-auth', token).header('x-auth', token).render('join', {message: 'You are logged in', name: user.name})
    });
});

app.get('/join', (req, res) => {
    var token = req.header('x-auth');
    User.findOne({where: {token: token}}).then(function (user) {
        if (!user) {
            res.status(400).render('index', {message: 'You must be logged in to enter !'});
        }
        res.render('join');
    });
});

app.get('/chat', (req, res) => {
    var token = req.header('x-auth');
    User.findOne({where: {token: token}}).then(function (user) {
        if (!user) {
            res.status(400).render('index', {message: 'You must be logged in to enter!'});
        }
        res.render('chat');
    });         
});

app.delete('/logout', (req, res) => {
    var token = req.header('x-auth');
    User.findOne({where: {token: token}}).then(function (user) {
        if (!user) {
            res.status(400)('index', {message: 'Some problems with the logout'});
        }
        res.status(200).clearCookie('x-auth', user.token);
    });
});

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('updateRoomList', rooms.getRoomList());

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
              return callback('Name and room name are required.');
        }
        if (!users.isUniqueUser(params.room, params.name)) {
            return callback(`User's name already taken`);
        }

        rooms.addRoom(params.room);

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.to(params.room).broadcast.emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
       
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);

        if (user && isRealString (message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
      
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
      
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));

            rooms.removeRoom(user.room, users.getUserList(user.room).length);
        }
  
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});
