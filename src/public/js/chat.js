const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormButton = $messageForm.querySelector('button')
const $messageFormInput = $messageForm.querySelector('input')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// Options
const queryString = window.location.search
const  username = new URLSearchParams(queryString).get('username')
const  room = new URLSearchParams(queryString).get('room')

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const containerHeight = $messages.scrollHeight

  // Scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
} 

socket.on('message', (message) => {
  const html = `<div class="message">
                  <p>
                    <span class="message__name">${message.username}</span>
                    <span class="message__meta">${message.createdAt}</span>
                  </p>
                  
                  <p>
                    ${message.text}
                  </p>
                </div>`
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
  $sidebar.innerHTML=""

  var listUser = ""
  users.forEach(user => {
    listUser += `<li>${user.username}</li>` 
  });

  const html = `<h2 class="room-title">${room}</h2>
                <h3 class="list-title">Users</h3>
                <ul class="users">`+
                  listUser
                +`</ul>`
  $sidebar.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  $messageFormButton.setAttribute('disabled', 'disabled')

  const message = e.target.elements.message.value
  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()
    
    if (error) {
      console.log(error);  
    }
    console.log("Message delivred!");
  })
})

socket.emit('join', {username, room}, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})