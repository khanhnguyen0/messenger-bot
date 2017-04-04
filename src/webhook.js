const express = require('express');
const bodyParser = require('body-parser');
const receiveMessage = require('./facebook-messenger/receiveMessage')


const APP_ID = (process.env.MESSENGER_APP_ID) ?
	process.env.MESSENGER_APP_ID :
	config.get('appId')

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
	process.env.MESSENGER_APP_SECRET :
	config.get('appSecret')

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
	(process.env.MESSENGER_VALIDATION_TOKEN) :
	config.get('validationToken')

// URL where the app is running (include protocol). Used to point to scripts and
// assets located at this address.
const SERVER_URL = (process.env.SERVER_URL) ?
	(process.env.SERVER_URL) :
	config.get('serverURL')

// Just stop the program if we don't have what we need
if (!(APP_SECRET && VALIDATION_TOKEN && SERVER_URL)) {
	log.error("Missing config values")
	process.exit(1)
}

const app  = express();
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/webhook', (req, res) => {

	const data = req.body

	// Make sure this is a page subscription
	if (data.object === 'page') {
		// Iterate over each entry
		// There may be multiple if batched
		data.entry.forEach((pageEntry) => {

			// Iterate over each messaging event
			pageEntry.messaging.forEach((messagingEvent) => {
				if (messagingEvent.message) return receiveMessage(messagingEvent)
				if (messagingEvent.postback) return receivePostback(messagingEvent)
				return log.debug("Webhook received unknown messagingEvent: ", messagingEvent)
			})
		})
	}

	// Assume all went well.
	//
	// You must send back a 200, within 20 seconds, to let us know you've
	// successfully received the callback. Otherwise, the request will time out.
	res.sendStatus(200)

})

module.exports = app
