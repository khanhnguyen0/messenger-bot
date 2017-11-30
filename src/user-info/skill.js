const { textMessage, quickReply } = require('../facebook-messenger/send-message');

const state = {};
const userInput = {};
const send = require('../facebook-messenger/send-message');

const askSkillLevel = (userID) => {
  state[userID]++;
  const choices = [
    {
      title: 'Basic',
      payload: 'basic',
    },
    {
      title: 'Intermediate',
      payload: 'intermediate',
    },
    {
      title: 'Proficiency',
      payload: 'proficiency',
    },
  ];
  return quickReply(userID, choices, 'Select skill level');
};

const askSkillName = (userID) => {
  state[userID]++;
  return textMessage(userID, 'What is your skill');
};


const addSkill = async (userID, payload) => {
  if (!state[userID]) state[userID] = 0; // initialize state for new user
  if (!userInput[userID]) userInput[userID] = {}; // initialize the user input
  switch (state[userID]) {
    case 0:
    // if (!payload){ //user select none
    //   state[userID] = undefined //clear the state
    //   userInput[userID] = undefined //clear the user input
    // }

      return askSkillName(userID);
      break;

    case 1:
      userInput[userID].name = payload;
      return askSkillLevel(userID);
      break;

    case 2:
      state[userID] = undefined;
      userInput[userID].level = payload;
      return userInput[userID];
  }
};

const editSkill = async (userID, skills) => {
  if (skills.length == 0) return send.textMessage(userID, 'Sorry, you have no skill to edit');

  const elements = skills.map((s, i) => ({
    title: s.name,
    subtitle: `${s.name}\n${s.level}`,
    buttons: [{
      type: 'postback',
      title: 'delete',
      payload: JSON.stringify({
        action: 'delete_skill',
        index: i,
      }),
    }],
  }));
  return send.carouselMessage(userID, elements);
};

module.exports = { addSkill, editSkill };
