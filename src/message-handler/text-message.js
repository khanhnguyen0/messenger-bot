const apiai = require('apiai');

const client = apiai('020e56ddc62c45d5898c84e717df0831')

const send = require('../facebook-messenger/send-message')
const mongoose = require('mongoose')
const askEducation = require('../user-info/education')
const askExperience = require('../user-info/experience')
const askSkill = require('../user-info/skill')
const User = require('../model/user.js');


mongoose.connect('mongodb://root:root@ds159254.mlab.com:59254/refugee')
mongoose.Promise = require('bluebird')
module.exports = async(senderId, message,quickReply) => {
  const u = await User.findOne({id: senderId})
    if (u)
    // return
    {
      const skill = await askSkill(senderId,message)
      if (skill) {
        u.skill.push(skill)
        u.save((err,updated)=>{
          if (err) return send.textMessage(senderId,"Error adding education")
          return send.textMessage(senderId,"skill added")
        })
      }
    } else {
      return createUser(senderId, message)
    }
}

const createUser = (senderId, message) => {
  let request = client.textRequest(message, {
    sessionId: senderId
  })
  request.on('response', function(response) {
    const {
      result
    } = response
    console.log('RESULT: ', JSON.stringify(result, undefined, 2));
    const {
      actionIncomplete,
      parameters,
      fulfillment
    } = result
    //
    if (actionIncomplete) {
      send.typingOn(senderId)
      return send.textMessage(senderId, fulfillment.speech)
    } else {
      var user = new User({
        "id": senderId,
        "name": parameters.name,
        "age": parameters.age.amount,
        "phone": parameters.phone,
        "email": parameters.email,
        "languages": parameters.language,
        "education": [],
        "experience": [],
        "skill": []
      });

      user.save((err, user) => {
        console.log('Saving user to mongodb');
        console.log('USER: ', JSON.stringify(user, undefined, 2));
        if (err) {
          console.log('ERROR SAVING USER TO mongodb ', err);
          return send.textMessage(senderId, 'ERROR SAVING USER TO mongodb');
        }
        return send.textMessage(senderId, 'User is saved to mongodb');

      });
      return send.textMessage(senderId, fulfillment.speech)
    }
    console.log('RESPONSE: ', JSON.stringify(response, undefined, 2));
  });

  request.on('error', function(error) {
    console.log(error);
  });

  request.end();
}
