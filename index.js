const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});

//when user connect -> this get executed
// io.on('connection', (socket) => {
//     console.log('A user connected');
//     setTimeout(() => {
//         //socket.send('Sent message after 4 seconds'); // send message with socket
        
//         //create custom event on Socket
//         socket.emit('testEvent', { description: 'Test pass object using socket io' });
//     }, 4000);
//     //when user disconnect -> this get executed
//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });

//Get event from Client
// io.on('connection', (socket) => {
//     socket.on('clientEvent', (data) => {
//         console.log(data);
//     });
// });

//Send message to all Client using Broadcast
let client = 0;
// io.on('connection', (socket) => {
//     client++;
//     io.sockets.emit('broadcast', { description: client.toString() + ' connected!' });
//     socket.on('disconnect', () => {
//         client--;
//         io.sockets.emit('broadcast', { description: client.toString() + ' connected!' });
//     });
// });

//Send welcome message to new User
// io.on('connection', (socket) => {
//     client++;
//     socket.emit('newClientConnected', { description: 'Hey, Welcome' });
//     socket.broadcast.emit('newClientConnected', { description: client.toString() + ' clients connected' });
//     socket.on('disconnect', () => {
//         client--;
//         socket.broadcast.emit('newClientConnected', { description: client.toString() + ' clients connected' });
//     });
// });

//Custom namespace
// var nsp = io.of('/my-namespace');
// nsp.on('connection', (socket) => {
//     client++;
//     nsp.emit('customnamespace', { description: client.toString() + ' clents connected' });
//     socket.on('disconnect', () => {
//         client--;
//         nsp.emit('customnamespace', { description: client.toString() + ' clents connected' });
//     });
// });

//Socket Room
let roomNo = 1;
io.on('connection', (socket) => {
    if(io.nsps['/'].adapter.rooms['room-' + roomNo] && io.nsps['/'].adapter.rooms['room-' + roomNo].length > 1) {
        roomNo++;
    }
    socket.join('room-' + roomNo);
    io.sockets.in('room-' + roomNo).emit('helloinroom', { description: 'You are in room ' + roomNo });
    socket.on('disconnect', () => {
        socket.leave('room-' + roomNo);
    });
});

server.listen(3000, () => console.log('Server Started !'));
