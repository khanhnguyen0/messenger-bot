// Send messages to users

const log			= require('loglevel-debug')('*:send-message')
const config		= require('config')
const fbAPI			= require('./send-api')
const appearHuman	= require('../util/appear-human')
const sentenceSplit	 = require('../util/sentence-split')

// Facebook Messenger API max message length
const MAX_MESSAGE_LENGTH	= config.get('apiMaxMessageLength')
const MAX_QR_TITLE_LENGTH	= config.get('apiMaxQuickMessageTitleLength')

/*
* Send a text message using the Send API.
*
*/
const textMessage = (id, text) => {

	log.debug("Sending a text message")
	// console.log('text :',text)
	return new Promise((resolve) => {

		//does the text need splitting? The message max length is MAX_MESSAGE_LENGTH.
		text = text.length > MAX_MESSAGE_LENGTH ? sentenceSplit(text, MAX_MESSAGE_LENGTH) : text

		const sendMessage = (text) => {

			const messageData = {
				recipient: {
					id
				},
				message: {
					text,
					metadata: ""
				}
			}

			return fbAPI(messageData)

		}

		// If this is just one message
		if (typeof text === 'string') {

			appearHuman(text)
			.then(() => {
				sendMessage(text)
				// Since we are done here
				.then(resolve)
			})

		}
		// If there are multiple messages (text is an array)
		else if (Array.isArray(text) && text.length > 0) {

			// Recurse through the array until it's empty
			const processRecursively = (messagesArray) => {

				typingOn(id)
				// Artificially delayed reply and then shift the array
				.then( () => appearHuman(messagesArray[0]) )
				.then( () => sendMessage(messagesArray.shift() ) )
				.then( () => {
					if (messagesArray.length === 0) return resolve()
					return processRecursively(messagesArray)
				})

			}

			// Start the recursive shifting
			processRecursively(text)

		}
		else {
			return resolve()
		}
	})
}
/*
* Send a message with Quick Reply buttons.
*
*/
const quickReply = (id, choices, text) => {

	log.debug("Sending a quick reply")

	return typingOn(id)
	.then( () => appearHuman(choices) )
	.then( () => {
		// console.log(choices)
		// Create the replies from the choices
		const replies = choices.map( (choice) => {
			if (Array.isArray(choice)) choice = choice[0]
			const title = choice.length < MAX_QR_TITLE_LENGTH ? choice : choice.substring(0,MAX_QR_TITLE_LENGTH-3) + '...'
			return {
				content_type : 'text',
				title,
				payload : choice
			}

		})

		const messageData = {
			recipient: {
				id
			},
			message: {
				text: text,
				quick_replies: replies
			}
		}

		// console.log(messageData.message.quick_replies)
		return fbAPI(messageData)
	})

}

/*
* Send a message with Quick Reply buttons.
*
*/
const locationQuickReply = (id, text) => {

	log.debug("Sending a location quick reply")

	return typingOn(id)
	.then( () => appearHuman(text) )
	.then( () => {

		const messageData = {
			recipient: {
				id
			},
			message: {
				text,
				quick_replies: [
					{
						content_type: 'location'
					},
					{
						content_type : 'text',
						title : 'Kirjoita osoite',
						payload : 'WrittenLocation'
					}
				]
			}
		}

		return fbAPI(messageData)
	})

}

/*
* Send a read receipt to indicate the message has been read
*
*/
const readReceipt = (id) => {

	log.debug("Sending a read receipt to mark message as seen")

	const messageData = {
		recipient: {
			id
		},
		sender_action: "mark_seen"
	}

	return fbAPI(messageData)

}

/*
* Turn typing indicator on
*
*/
const typingOn = (id) => {

	log.debug("Turning typing indicator on")

	const messageData = {
		recipient: {
			id
		},
		sender_action: "typing_on"
	}

	return fbAPI(messageData)

}

/*
* Turn typing indicator off
*
*/
const typingOff = (id) => {

	log.debug("Turning typing indicator off")

	const messageData = {
		recipient: {
			id
		},
		sender_action: "typing_off"
	}

	return fbAPI(messageData)
}

/*
* Send image message
*
*/
const imageMessage = (id, url) => {

	log.debug("Sending image message")

	const messageData = {
		recipient: {
			id
		},
		message:{
			attachment:{
				type: "image",
				payload: {
					url
				}
			}
		}
	}

	return fbAPI(messageData)

}

/*
* Send template message
*
*/
const templateMessage = (id, {title, subtitle, item_url, image_url, buttonTitle, webview_height_ratio, messenger_extensions}) => {

	log.debug("Sending template message")

	let buttonData
	if (buttonTitle) {
		buttonData = [
			{
				type: 'web_url',
				url: item_url,
				title: buttonTitle,
				webview_height_ratio: webview_height_ratio || 'full',
				messenger_extensions: messenger_extensions || undefined
			}
		]
	}

	const messageData = {
		recipient: {
			id
		},
		message:{
			attachment:{
				type: 'template',
				payload:{
					template_type: 'generic',
					elements:[
						{
							title,
							image_url,
							subtitle,
							buttons: buttonData
						}
					]
				}
			}
		}
	}

	return typingOn(id)
	.then( () => appearHuman() )
	.then( () => fbAPI(messageData) )

}

/*
* Send template message
*
*/
const postbackMessage = (id, {title, subtitle, item_url, image_url, buttons}) => {

	log.debug("Sending postback message")

	const messageData = {
		recipient: {
			id
		},
		message:{
			attachment:{
				type: 'template',
				payload:{
					template_type: 'generic',
					elements:[
						{
							title,
							item_url,
							image_url,
							subtitle,
							buttons
						}
					]
				}
			}
		}
	}

	return typingOn(id)
	.then( () => appearHuman() )
	.then( () => fbAPI(messageData) )

}

/*
* Send template message
*
*/
const carouselMessage = (id, elements) => {

	log.debug("Sending carousel message")

	const messageData = {
		recipient: {
			id
		},
		message:{
			attachment:{
				type: 'template',
				payload:{
					template_type: 'generic',
					elements
				}
			}
		}
	}

	return typingOn(id)
	.then( () => appearHuman() )
	.then( () => fbAPI(messageData) )

}

/*
 * Send a file using the Send API.
 *
 */
const fileMessage = (id, url) => {

	log.debug("Sending file message:")

	var messageData = {
		recipient: {
			id
		},
		message: {
			attachment: {
				type: 'file',
				payload: {
					url
				}
			}
		}
	}

	return typingOn(id)
	.then( () => appearHuman() )
	.then( () => fbAPI(messageData) )

}

module.exports.textMessage = textMessage
module.exports.quickReply = quickReply
module.exports.locationQuickReply = locationQuickReply
module.exports.readReceipt = readReceipt
module.exports.typingOn = typingOn
module.exports.typingOff = typingOff
module.exports.imageMessage = imageMessage
module.exports.templateMessage = templateMessage
module.exports.carouselMessage = carouselMessage
module.exports.fileMessage = fileMessage
module.exports.postbackMessage = postbackMessage
