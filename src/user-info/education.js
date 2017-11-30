const { textMessage, quickReply } = require('../facebook-messenger/send-message');

const state = {};
const userInput = {};
const send = require('../facebook-messenger/send-message');

const askEducationLevel = (userID) => {
  state[userID]++;
  const choices = [
    {
      title: "Bachelor's degree",
      payload: 'bachelor',
    },
    {
      title: "Master's degree",
      payload: 'master',
    },
    {
      title: 'Vocational school',
      payload: 'vocation_school',
    },
    {
      title: 'PhD',
      payload: 'phd',
    },
  ];
  return quickReply(userID, choices, 'Select education level');
};

const askStartYear = (userID) => {
  state[userID]++;
  return textMessage(userID, 'When did you start?');
};


const askEndYear = (userID) => {
  state[userID]++;
  return textMessage(userID, 'When did you finish?');
};


const askSchoolName = (userID) => {
  state[userID]++;
  return textMessage(userID, 'What is your school name?');
};

const askDegree = (userID) => {
  state[userID]++;
  return textMessage(userID, "What's the name of your degree");
};

const addEducation = async (userID, payload) => {
  // initialize state for new user
  if (!state[userID]) state[userID] = 0;
  // initialize the user input
  if (!userInput[userID]) userInput[userID] = {};

  switch (state[userID]) {
    case 0:
    // if (!payload){ //user select none
    //   state[userID] = undefined //clear the state
    //   userInput[userID] = undefined //clear the user input
    // }

      return askEducationLevel(userID);
      break;

    case 1:
      userInput[userID].level = payload;
      return askStartYear(userID);
      break;

    case 2:
      userInput[userID].from = payload;
      return askEndYear(userID);
      break;

    case 3:
      userInput[userID].to = payload;
      return askSchoolName(userID);
      break;

    case 4:
      userInput[userID].school = payload;
      return askDegree(userID);

    case 5:
      state[userID] = undefined;
      userInput[userID].degree = payload;
      return userInput[userID];
  }
};

const editEducation = async (userID, educations) => {
  if (educations.length == 0) return send.textMessage(userID, 'Sorry, you have no education to edit');

  const elements = educations.map((e, i) => ({
    title: e.level,
    subtitle: `${e.school}\n${e.from}-${e.to}\n${e.degree}`,
    buttons: [{
      type: 'postback',
      title: 'delete',
      payload: JSON.stringify({
        action: 'delete_education',
        index: i,
      }),
    }],
  }));
  return send.carouselMessage(userID, elements);
};
module.exports = { addEducation, editEducation };
