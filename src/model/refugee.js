const mongoose = require('mongoose')

const refugeeSchema = mongoose.Schema({
	"id": String,
	"name": String,
	"dob": String,
	"number": String,
	"email": String,
	"education": String
})

module.exports = mongoose.model('refugeeSchema', refugeeSchema)