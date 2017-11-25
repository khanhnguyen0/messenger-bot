const app = require('./src/webhook')
const process = require('process')
const PORT = process.env.PORT  || 80 
/* If running on debug mode ask Config manager for debug config. */
const config = require('./config/config_manager')(process.env.production)
require('http').createServer(app).listen(PORT, ()=>{
  console.log('listening on port',PORT);
})
