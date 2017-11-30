const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('../src/util/mongoose')

const cvRouter = express.Router()

cvRouter.use(bodyParser.json())
const User = require('../src/model/user.js');

cvRouter.route('/:userId')
.get(async (req, res) => {
	const userId = req.params.userId
	console.log('USER ID: ', userId)
	// Get user object from MongoDb
	const user = await User.findOne({id:userId})

	_formatUserInfo(user);

    // render cv using template
    res.render('cv.hbs', user)
})

/**
 *
 * format user information
 *
 */
const _formatUserInfo = (user) => {
	user.firstname = _toTitleCase(user.firstname);
	user.lastname = _toTitleCase(user.lastname);

	user.education = user.education.map((edu) => {
		edu.level = _formatEducationLevel(edu.level);
		edu.degree = _toTitleCase(edu.degree);
		edu.school = _toTitleCase(edu.school);

		return edu;
	})

	user.experience = user.experience.map(exp => {
		exp.company = _toTitleCase(exp.company);
		exp.title = _toTitleCase(exp.title);

		return exp;
	})

	return user;
}

/**
 *
 * Changing the string e.g. 'helsinki metropolia' => 'Helsinki Metropolia'
 *
 */
const _toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

/**
 *
 * Return the correct form of educational level
 *
 */
const _formatEducationLevel = (level) => {
	switch (level){
		case 'bachelor': 
			return 'Bachelor\'s Degree';
		case 'master':
			return 'Master\' Degree';
		case 'vocation_school':
			return 'Vocational School';
		case 'phd':
			return 'PhD';
		default:
			return level;
	}
}

module.exports = cvRouter;
