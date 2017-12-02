const handler = require('../message-handler/index')

const receiveMessage = (event) => {
	const {
		sender, recipient, timestamp, message,
	} = event
	const {
		is_echo, mid, app_id, metadata, text, attachments, quick_reply,
	} = message

	console.log('Received message for user %d and page %d at %d with message:', sender.id, recipient.id, timestamp)
	console.log(JSON.stringify(message))

	if (is_echo) {
		// Just logging message echoes to console
		return console.log('Received echo for message %s and app %d with metadata %s', mid, app_id, metadata)
	} else if (quick_reply) {
		// Quick replies are handed to wit
		const payload = quick_reply.payload
		console.log('Quick reply for message %s with payload %s', mid, payload)
		return handler.incomingTextMessage(sender.id, payload, true)
	} else if (text) {
		return handler.incomingTextMessage(sender.id, text)
	} else if (attachments) {
		if (attachments[0].type === 'location') {
			return handler.incomingLocationMessage(sender.id, attachments[0])
		} else if (attachments[0].type === 'image') {
			console.log(attachments)
			return handler.incomingImageMessage(sender.id, attachments[0])
		} else if (attachments[0].type === 'audio') {
			return handler.incomingAudioMessage(sender.id, attachments[0])
		}

		return handler.incomingUnknownMessage(sender.id, attachments[0])
	}
}

module.exports = receiveMessage
