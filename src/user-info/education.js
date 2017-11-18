const {textMessage, quickReply} = require('../facebook-messenger/send-message')

const state = {}

const askEducationLevel = (userID) =>{
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
  return quickReply(userID,quickReply,"Select education level")
}

const askStartYear = (userID) =>{
  state[userID]++
  return sendMessage(userID,"When did you start?")
}


const askEndYear = (userID) =>{
  state[userID]++
  return sendMessage(userID,"When did you finish?")
}


const askSchoolName = (userID) =>{
  state[userID]++
  return sendMessage(userID,"What is your school name?")
}

const userInput = {}

const addEducation = async (userID,message,payload)=>{
  if (!state[userID]) state[userID] = 0 // initialize state for new user
  if (!userInput[userID]) userInput[userID] = {} //initialize the user input
  switch (state[userID]){
    case 0:
    if (!payload){ //user select none
      state[userID] = undefined //clear the state
      userInput[userID] = undefined //clear the user input
    }

    return askEducationLevel(userID)
    break

    case 1:
    return askStartYear(userID)
    break

    case 2:
    return askEndYear(userID)
    break

    case 3:
    return askSchoolName(userID)
    break

    case 4:
    return
  }
}
