const express = require("express")
const {Server: SocketServer } = require( "socket.io")
const port = 3000

const app = express()


app.use('/', express.static('public'));

const httpServer = app.listen(port, () => {
    console.log('Server started on port ', port)
})

const io = new SocketServer(httpServer);

io.on("connection", (socket) => {
    console.log('new connection from ', socket.id)

    socket.on("sdp-offer", (offer) => { 
        console.log('New SDP offer from local user ', socket.id);
        console.log("SPD OFFER ", offer)
        socket.broadcast.emit('sdp-offer', offer)
    });


    socket.on("sdp-answer", (answer) => { 
        console.log('New SDP answer from remote user ', socket.id);
        console.log("SDP ANSWER from remote user ", answer)        
        socket.broadcast.emit('sdp-answer', answer)
    });

    socket.on("ice-candidate", (candidate) => { 
        console.log('New ICE candidate from ', socket.id);
        console.log("ICE candidate ", candidate)        
        socket.broadcast.emit('ice-candidate', candidate)
    });

    




    socket.on

})