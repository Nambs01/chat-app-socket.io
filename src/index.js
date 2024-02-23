const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { generateMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, './public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({id: socket.id, ...options})
    
    if (error) {
      return callback(error)
    }
    socket.join(user.room) // entrer dans le groupe
    
    // envoyer a elle meme
    socket.emit('message', generateMessage('Admin', 'Welcome!'))   
    // envoyer a tout les membres du groupe sauf elle
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin' ,`${user.username} has joined!`))  
    
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
    callback()
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('message', generateMessage(user.username, message))
    callback()
  })
  
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if (user) {
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
    }
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
})