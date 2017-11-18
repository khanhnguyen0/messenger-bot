const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    "id": String,
    "name": String,
    "age": String,
    "phone": String,
    "email": String,
    "languages": [String],
    "education": [{
        "level": String,
        "from": String,
        "to": String,
        "school": String
    }],
    "experience": [{
    	"from": String,
    	"to": String,
    	"company": String,
    	"description": String
    }],
    "skill": [{
    	"name": String,
    	"proficiency": String
    }]
});

module.exports = mongoose.model('userSchema', userSchema);