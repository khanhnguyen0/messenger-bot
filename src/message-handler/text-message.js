const send		= require('../facebook-messenger/send-message')
const mongoose = require('mongoose')
mongoose.connect('mongodb://root:root@ds159254.mlab.com:59254/refugee')

 module.exports = (senderId, message) => {

   send.typingOn(senderId)
   send.textMessage(senderId, "Hello! we are working at the moment")
}
