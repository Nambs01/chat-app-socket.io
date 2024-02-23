const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  // clean data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // validate data 
  if (!username || !room) {
    return({
      error: "Username and Room are required!"
    })
  }

  // check for existing user
  const existingUser = users.find((user) => {
    return user.username === username && user.room === room
  })

  // validation username
  if (existingUser) {
    return({
      error: "Username is in use!"
    })
  }

  // store user
  const user = { id, username, room }
  users.push(user)

  return {user}
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = (id) => {
  const user = users.find((user) => user.id === id)
  if (!user) {
    return({
      error: "user has not existed"
    })
  }
  return user
}

const getUsersInRoom = (room) => {
  const Room = room.trim().toLowerCase()
  const usersInRoom = users.filter((user) => user.room === Room)

  return usersInRoom
}

module.exports = {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom
}