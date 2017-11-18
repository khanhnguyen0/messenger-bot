const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    "id": {type:String,unique:true},
    "name": String,
    "age": String,
    "phone": String,
    "email": String,
    "languages": [String],
    "education": [{
        "level": String,
        "from": String,
        "to": String,
        "school": String,
        "degree":String
    }],
    "experience": [{
    	"from": String,
    	"to": String,
    	"company": String,
    	"description": String,
      "title":String
    }],
    "skill": [{
    	"name": String,
    	"proficiency": String
    }]
});

module.exports = mongoose.model('userSchema', userSchema);
