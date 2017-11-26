const mongoose = require('mongoose')
mongoose.connect('mongodb://root:root@ds159254.mlab.com:59254/refugee')
mongoose.Promise = require('bluebird')

module.exports = mongoose
