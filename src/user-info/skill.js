const {textMessage, quickReply} = require('../facebook-messenger/send-message')

const state = {}
const userInput = {}

const askSkillLevel = (userID) =>{
  state[userID]++
  const choices = [
    {
      title:"Basic",
      payload:"basic"
    },
    {
      title:"Intermediate",
      payload:"intermediate"
    },
    {
      title:"Proficiency",
      payload:"proficiency"
    }
  ]
  return quickReply(userID,choices,"Select skill level")
}

const askSkillName = (userID) =>{
  state[userID]++
  return textMessage(userID,"What is your skill")
}



const addSkill = async (userID,payload)=>{
  if (!state[userID]) state[userID] = 0 // initialize state for new user
  if (!userInput[userID]) userInput[userID] = {} //initialize the user input
  switch (state[userID]){
    case 0:
    // if (!payload){ //user select none
    //   state[userID] = undefined //clear the state
    //   userInput[userID] = undefined //clear the user input
    // }

    return askSkillName(userID)
    break

    case 1:
    userInput[userID]["name"]=payload
    return askSkillLevel(userID)
    break

    case 2:
    state[userID] = undefined
    userInput[userID]["level"]=payload
    return userInput[userID]
  }
}
module.exports = addSkill
