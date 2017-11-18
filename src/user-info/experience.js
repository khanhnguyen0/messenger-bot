const {textMessage, quickReply} = require('../facebook-messenger/send-message')

const state = {}
const userInput = {}

const askDescription = (userID) =>{
  state[userID]++
  return textMessage(userID,"Enter job description")
}

const askStartYear = (userID) =>{
  state[userID]++
  return textMessage(userID,"When did you start?")
}


const askEndYear = (userID) =>{
  state[userID]++
  return textMessage(userID,"When did you finish?")
}


const askCompanyName = (userID) =>{
  state[userID]++
  return textMessage(userID,"What is your company name?")
}

const askJobTitle = (userID) =>{
  state[userID]++
  return textMessage(userID,"What's your job title")
}

const addExperience = async (userID,payload)=>{
  if (!state[userID]) state[userID] = 0 // initialize state for new user
  if (!userInput[userID]) userInput[userID] = {} //initialize the user input
  switch (state[userID]){
    case 0:
    // if (!payload){ //user select none
    //   state[userID] = undefined //clear the state
    //   userInput[userID] = undefined //clear the user input
    // }

    return askStartYear(userID)
    break

    case 1:
    userInput[userID]["from"]=payload
    return askEndYear(userID)
    break

    case 2:
    userInput[userID]["to"]=payload
    return askCompanyName(userID)
    break

    case 3:
    userInput[userID]["company"]=payload
    return askJobTitle(userID)
    break

    case 4:
    userInput[userID]["title"]=payload
    return askDescription(userID)

    case 5:
    userInput[userID]["description"]=payload
    return userInput[userID]
  }
}
module.exports = addExperience
