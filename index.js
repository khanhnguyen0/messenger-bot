const app = require('./src/webhook')
const process = require('process')
const PORT = 80 || process.env.PORT
/* If running on debug mode ask Config manager for debug config. */
const config = require('./config/config_manager')(process.env.production)
require('http').createServer(app).listen(PORT, ()=>{
  console.log('listening on port',PORT);
})
