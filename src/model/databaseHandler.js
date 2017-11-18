const mongoose = require('mongoose');
const User = require('./user.js');

createUser(user) => {
	return new User(user);
}
