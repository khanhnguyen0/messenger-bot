const send = require('../facebook-messenger/send-message')
const mongoose = require('../util/mongoose')
const User = require('../model/user')

const receivePostback = async (message) => {
  const {sender,postback} = message
  const {id} = sender
  const payload = JSON.parse(postback.payload)
  u = await User.findOne({id})
  console.log(u,payload)
  switch(payload.action){
    case "delete_experience":
      if (u.experience.length == 1 && payload.index==0) // when the array only has 1 element, splice doesn't work
      {
        u.experience = []
      }
      else
      {
        u.experience = u.experience.splice(payload.index,1)
      }
      console.log(u)
      u.save(err=>{
        if (err) return send.textMessage(id,"Error deleting experience, try again")
        return send.textMessage(id,"experience deleted successfully")
      })
    break

    case "delete_skill":
    if (u.skill.length == 1 && payload.index == 0) // when the array only has 1 element, splice doesn't work
      {
        u.skill = []
      }
      else
      {
        u.skill = u.skill.splice(payload.index,1)
      }
      u.save(err=>{
        if (err) return send.textMessage(id,"Error deleting skill, try again")
        return send.textMessage(id,"skill deleted successfully")
      })
    break

    case "delete_education":
      if (u.education.length == 1  && payload.index == 0) // when the array only has 1 element, splice doesn't work
      {
        u.education = []
      }
      else
      {
        u.education = u.education.splice(payload.index,1)
      }
      u.save(err=>{
        if (err) return send.textMessage(id,"Error deleting education, try again")
        return send.textMessage(id,"education deleted successfully")
      })
    break

    default:
    console.log("invalid action", payload.action)
  }
}

module.exports = receivePostback
