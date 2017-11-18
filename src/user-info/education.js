const {textMessage, quickReply} = require('../facebook-messenger/send-message')

const state = {}
const userInput = {}

const askEducationLevel = (userID) =>{
  state[userID]++
  const choices = [
    {
      title:"Bachelor degree",
      payload:"bachelor"
    },
    {
      title:"Master degree",
      payload:"master"
    },
    {
      title:"Vocational school",
      payload:"vocation_school"
    },
    {
      title:"None",
      payload:""
    }
  ]
  return quickReply(userID,choices,"Select education level")
}

const askStartYear = (userID) =>{
  state[userID]++
  return textMessage(userID,"When did you start?")
}


const askEndYear = (userID) =>{
  state[userID]++
  return textMessage(userID,"When did you finish?")
}


const askSchoolName = (userID) =>{
  state[userID]++
  return textMessage(userID,"What is your school name?")
}

const askDegree = (userID) =>{
  state[userID]++
  return textMessage(userID,"What's the name of your degree")
}

const addEducation = async (userID,payload)=>{
  if (!state[userID]) state[userID] = 0 // initialize state for new user
  if (!userInput[userID]) userInput[userID] = {} //initialize the user input
  switch (state[userID]){
    case 0:
    // if (!payload){ //user select none
    //   state[userID] = undefined //clear the state
    //   userInput[userID] = undefined //clear the user input
    // }

    return askEducationLevel(userID)
    break

    case 1:
    userInput[userID]["level"]=payload
    return askStartYear(userID)
    break

    case 2:
    userInput[userID]["from"]=payload
    return askEndYear(userID)
    break

    case 3:
    userInput[userID]["to"]=payload
    return askSchoolName(userID)
    break

    case 4:
    userInput[userID]["school"]=payload
    return askDegree(userID)

    case 5:
    state[userID] = undefined
    userInput[userID]["degree"]=payload
    return userInput[userID]
  }
}
module.exports = addEducation
