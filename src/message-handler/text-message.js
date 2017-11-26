const apiai = require('apiai-promise');

const client = apiai('020e56ddc62c45d5898c84e717df0831')

const send = require('../facebook-messenger/send-message')
const mongoose = require('../util/mongoose')
const {addEducation,editEducation} = require('../user-info/education')
const {addExperience, editExperience} = require('../user-info/experience')
const {askSkill,editSkill} = require('../user-info/skill')
const User = require('../model/user.js');
const state = {}

module.exports = async(senderId, message, quickReply) => {
  const u = await User.findOne({id: senderId})

    if (u)
    // return
    {
      console.log(state)
      if (!state[senderId]) // no state, use wit to extract the user action
      {
        const {result} = await client.textRequest(message, {
          sessionId: senderId
        })
        const {action} = result
        console.log(action)
        if (action!="input.unknown") state[senderId] = action
        else
        return send.textMessage(senderId,"Sorry I can't understand")
        console.log(state)
      }

      // console.log(response)
      switch (state[senderId]){
        case 'create_skill':
        const skill = await askSkill(senderId,message)
        if (skill) {
          state[senderId] = undefined // clear the bot state
          u.skill.push(skill)
          u.save((err,updated)=>{

            if (err) return send.textMessage(senderId,"Error adding education")
            return send.textMessage(senderId,"skill added")
          })
        }
        break

      case 'create_education':
      const education = await addEducation(senderId,message)
      if (education) {
        state[senderId] = undefined // clear the bot state
        u.education.push(education)
        u.save((err,updated)=>{
          if (err) return send.textMessage(senderId,"Error adding education")
          return send.textMessage(senderId,"education added")
        })
      }
      break

      case 'create_experience':
      const experience = await addExperience(senderId,message)
      if (experience) {
        state[senderId] = undefined // clear the bot state
        u.experience.push(experience)
        u.save((err,updated)=>{
          if (err) return send.textMessage(senderId,"Error adding education")
          return send.textMessage(senderId,"experience added")
        })
      }
      break

      case 'edit_education':
      state[senderId] = undefined
      // console.log(u.skill)
      return editEducation(senderId,u.education)
      break

      case 'edit_skill':
      state[senderId] = undefined
      // console.log(u.skill)
      return editSkill(senderId,u.skill)
      break

      case 'edit_experience':
      state[senderId] = undefined
      // console.log(u.skill)
      return editExperience(senderId,u.experience)
      break

      default:
      return send.textMessage(senderId,"Sorry I can't understand")
      }

    } else {
      console.log('NOT A USER YET')
      return createUser(senderId, message)
    }
}

const createUser = async (senderId, message) => {
  const response = await client.textRequest(message, {
    sessionId: senderId
  })

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

  request.on('error', function(error) {
    console.log(error);
  });

  request.end();
}
