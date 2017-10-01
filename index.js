const app = require('./src/webhook')
const process = require('process')

/* If running on debug mode ask Config manager for debug config. */
const config = require('./config/config_manager')(process.env.production)

require('http').createServer(app).listen(80, ()=>{
  console.log('listening on port 6000');
})
