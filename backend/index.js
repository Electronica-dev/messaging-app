const express = require('express');
const app = express();
http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const STATIC_CHANNELS = require('./static_channels.json');

app.use(cors());

const server = http.createServer(app);

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let rooms = []
// let customer_id
// let agent_id
STATIC_CHANNELS.forEach((ch) => rooms.push(ch.id))

io.on('connection', (socket) => {
  // socket.join(rooms)
  // console.log('socket rooms', socket.rooms);

  socket.emit('connection', socket.id);

  socket.on('room-join', id => {
    console.log(`User joined ${socket.id}`);
    agent_id = id
    if(!socket.rooms.has(id)) {
      socket.rooms.forEach((x) => {
        if(!isNaN(x)) {
          socket.rooms.delete(x)
        }
      })
    }
    socket.join(id)
    console.log('socket rooms', socket.rooms);
    STATIC_CHANNELS.forEach(c => {
      if (c.id === id) {
        if (c.sockets.indexOf(socket.id) == (-1)) {
          c.sockets.push(socket.id);
          c.participants++;
          io.emit('room', c);
        }
      } else {
        let index = c.sockets.indexOf(socket.id);
        if (index != (-1)) {
          c.sockets.splice(index, 1);
          c.participants--;
          io.emit('room', c);
        }
      }
    });
    // return id;
  })

  socket.on('send-message', message => {
    console.log('sending message', message.room_id);
    STATIC_CHANNELS.forEach(c => {
      if(c.id == message.room_id) {
        console.log('channel id cmessage', c, c.id);
        c.messages.push(message)
      }
    })
    //TODO: something here
    io.to(message.room_id).emit("message", message);
    // io.emit('message', message);
  })

  socket.on('send-customer-message', message => {
    console.log('sending customer message', message.room_id);
    STATIC_CHANNELS.forEach(c => {
      if(c.id == message.room_id) {
        c.messages.push(message)
        console.log('channel id cmessage', c, c.id);
      }
    })
    io.to(message.room_id).emit("customer-message", message);
    // io.emit('customer-message', message);
    // io.to(socket.id).emit('customer-message', 'let\'s see if this actually workssss')
  })

  // io.to(socket.id).emit('private', 'let\'s see if this actually workssss')

  socket.on('disconnect', () => {
    // socket.leave(agent_id)
    console.log('disconnected', socket.rooms, socket.id);
    STATIC_CHANNELS.forEach(c => {
      let index = c.sockets.indexOf(socket.id);
      if(index != (-1)) {
        c.sockets.splice(index, 1);
        c.participants--;
        io.emit('room', c);
      }
    })
  })
});

app.get('/getChannels', (req, res) => {
  res.json({
    channels: STATIC_CHANNELS
  })
})

app.get('/customer/:cid', (req, res) => {
  const cid = req.params.cid
  let flag = false
  STATIC_CHANNELS.forEach(ch => {
    if(ch.id == cid) {
      console.log('flag is true');
      flag = true
      res.json(ch)
    }
  })
  if(!flag) {
    console.log('inside flag because requested channel is not present');
    console.log(cid, typeof cid);
    let ch = {
      "name": cid,
      "participants": 0,
      "id": Number(cid),
      "sockets": [],
      "messages": []
    }
    STATIC_CHANNELS.push(ch)
    res.json(ch)
  }
})

app.get('/customer', (req, res) => {

})

server.listen(8080, () =>
  console.log('Server is running on port 8080')
);
