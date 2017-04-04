const send		= require('../facebook-messenger/send-message')

module.exports = (senderId, audioData) =>{
  send.typingOn(senderId)
  send.textMessage(senderId, "You just sent an audio, brb")
}
