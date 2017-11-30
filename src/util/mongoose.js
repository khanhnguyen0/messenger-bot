const mongoose = require('mongoose');

mongoose.connect('mongodb://root:root@ds123796.mlab.com:23796/sewi');
mongoose.Promise = require('bluebird');

module.exports = mongoose;
