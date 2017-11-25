const express = require('express');
const bodyParser = require('body-parser');
const receiveMessage = require('./facebook-messenger/receive-message')
const config = require('config')

const hbs = require('hbs')
const path = require('path')
const cvRouter = require('../routes/cvRouter')

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
    console.log("Missing config values")
    process.exit(1)
}

const app = express();
// app.set('view engine', 'ejs')
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, '../public')))

app.use('/cv', cvRouter)

app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        console.log("Validating webhook")
        res.status(200).send(req.query['hub.challenge'])
    } else {
        console.log(req.query['hub.verify_token']);
        console.log(VALIDATION_TOKEN);
        console.log("Failed validation. Make sure the validation tokens match.")
        res.sendStatus(403)
    }
})

app.post('/webhook', (req, res) => {
    const data = req.body
    console.log(JSON.stringify(data));
    // Make sure this is a page subscription
    if (data.object === 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach((pageEntry) => {

            // Iterate over each messaging event
            pageEntry.messaging.forEach((messagingEvent) => {
                if (messagingEvent.message) return receiveMessage(messagingEvent)
                if (messagingEvent.postback) return receivePostback(messagingEvent)
                return console.log("Webhook received unknown messagingEvent: ", messagingEvent)
            })
        })
    }

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200)

})


app.get('/cv', (req, res) => {
    const user = {
        "id": 1235,
        "name": 'Thanh Binh Tran',
        "age": '23',
        "phone": '012345678',
        "email": 'kjd@mail.com',
        'address': 'Kaivokatu 8B',
        "languages": ['vn', 'vvd', 'fddf'],
        "education": [{
            "level": 'Bachelor\'s degree',
            "from": 2014,
            "to": 2018,
            "school": 'Metropolia UAS',
            "degree": 'Information Technology'
        }],
        "experience": [{
            "from": 2013,
            "to": 2016,
            "company": 'Transval Oy',
            "description": 'This is a description',
            "title": 'Logistic worker'
        }, {
            "from": 2016,
            "to": 'present',
            "company": 'Frosmo Oy',
            "description": 'This is a description',
            "title": 'Web developer'
        }],
        "skill": [{
                "name": 'JavaScript',
                "level": 'Advanced'
            },
            {
                "name": 'Web development',
                "level": 'Advanced'
            }
        ]
    }
    res.render('cv.hbs', user)
})



module.exports = app