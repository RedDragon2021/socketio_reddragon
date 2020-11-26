const express = require('express');
const socket_io = require('socket.io');
const path = require('path');
const app = express();

const port = process.env.PORT || 8889;

app.set('port', port);
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res)=>{
    // res.send({msg:"Hello Socket.io"});
    res.render("socketio.ejs");
});

const server = app.listen(port, ()=>{
    console.log("Server is running on port: "+port);
});

const io = socket_io(server);

io.on("connection", (socket)=>{
    console.log("New client is connected");

    socket.username = "Anonymous";

    socket.on('changeUsername', (data)=>{
        console.log('changeUsername data = '+JSON.stringify(data));
        socket.username = data.username;
    });

    socket.on('sendMsg', (data)=>{
        console.log('Client sendMsg data = '+JSON.stringify(data));
        // socket.msg = data.msg;
        io.emit('receiveMsg', { username:socket.username, msg: data.msg });
    });

    socket.on('isTyping', ()=>{
        io.emit('isTyping', { username:socket.username});
    });

});