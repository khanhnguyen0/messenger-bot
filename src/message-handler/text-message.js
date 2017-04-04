const send		= require('../facebook-messenger/send-message')

 module.exports = (senderId, message) => {

   send.typingOn(senderId)
   send.textMessage(senderId, "Hello! we are working at the moment")
}
