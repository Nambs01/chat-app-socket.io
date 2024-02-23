const generateMessage = (username,text) => {
  return{
    username,
    text,
    createdAt: new Date().toLocaleTimeString()
  }
}

module.exports = {
  generateMessage
}