//The facebook messenger send api is used through this

// const log		= require('loglevel-debug')('*:send-api')
const config	= require('config')
const request	= require('request-promise-native')

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
(process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
config.get('pageAccessToken')

// Just stop the program if we don't have what we need
if (!PAGE_ACCESS_TOKEN) {
	console.error("Missing config values")
	process.exit(1)
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
const callSendAPI = (messageData) => {

	return new Promise((resolve, reject) => {

		const options = {
			resolveWithFullResponse: true,
			uri: 'https://graph.facebook.com/v2.6/me/messages',
			qs: { access_token: PAGE_ACCESS_TOKEN },
			method: 'POST',
			json: messageData
		}

		request(options)
		.then( (response) => {

			if (response.statusCode !== 200) {
				console.log("Failed calling Send API", response.statusCode, response.statusMessage, response.body.error)
				return reject()
			}

			const recipientId = response.body.recipient_id
			const messageId = response.body.message_id

			if (messageId) {
				console.log("Successfully sent message with id %s to recipient %s", messageId, recipientId)
			}
			else {
				console.log("Successfully called Send API for recipient %s", recipientId)
			}

			return resolve()

		})
	})
}

module.exports = callSendAPI
