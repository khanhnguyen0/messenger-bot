const apiai = require('apiai');

const client = apiai('020e56ddc62c45d5898c84e717df0831')

const send = require('../facebook-messenger/send-message')
const mongoose = require('mongoose')

mongoose.connect('mongodb://root:root@ds159254.mlab.com:59254/refugee')

module.exports = async (senderId, message) => {
  let request = client.textRequest(message, {sessionId: senderId})
  request.on('response', function(response) {
    const {result} = response
    const {actionIncomplete, parameters, fulfillment} = result
    if (actionIncomplete){
      send.typingOn(senderId)
      return send.textMessage(senderId, fulfillment.speech)
    }
    else return send.textMessage(senderId, fulfillment.speech)
    console.log(response);
  });

  request.on('error', function(error) {
    console.log(error);
  });

  request.end();


}
