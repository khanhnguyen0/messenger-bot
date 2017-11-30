const express = require('express');
const bodyParser = require('body-parser');

const cvRouter = express.Router();
cvRouter.use(bodyParser.json());
const User = require('../src/model/user.js');

cvRouter.route('/:userId')
  .get(async (req, res) => {
    const userId = req.params.userId;
    console.log('USER ID: ', userId);
    // Get user object from MongoDb
    const user = await User.findOne({ id: userId });

    formatUserInfo(user);

    // render cv using template
    res.render('cv.hbs', user);
  });

/**
 *
 * Changing the string e.g. 'helsinki metropolia' => 'Helsinki Metropolia'
 *
 */
const toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

/**
 *
 * Return the correct form of educational level
 *
 */
const formatEducationLevel = (level) => {
  switch (level) {
    case 'bachelor':
      return 'Bachelor\'s Degree';
    case 'master':
      return 'Master\' Degree';
    case 'vocationschool':
      return 'Vocational School';
    case 'phd':
      return 'PhD';
    default:
      return level;
  }
};

/**
 *
 * format user information
 *
 */
const formatUserInfo = (user) => {
  const formattedUser = JSON.parse(JSON.stringify(user));
  formattedUser.firstname = toTitleCase(formattedUser.firstname);
  formattedUser.lastname = toTitleCase(formattedUser.lastname);

  formattedUser.education = formattedUser.education.map((edu) => {
    edu.level = formatEducationLevel(edu.level);
    edu.degree = toTitleCase(edu.degree);
    edu.school = toTitleCase(edu.school);

    return edu;
  });

  formattedUser.experience = formattedUser.experience.map((exp) => {
    exp.company = toTitleCase(exp.company);
    exp.title = toTitleCase(exp.title);

    return exp;
  });

  return formattedUser;
};

module.exports = cvRouter;
