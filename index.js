require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.port || 3000;

const twilioClient = require('twilio')(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN,
);

const dialogflow = require('@google-cloud/dialogflow');
const sessionClient = new dialogflow.SessionsClient();

// twilio sends application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

app.use(express.json());

app.post('/whatsapp', async function(req, res) {

	const from = req.body.From;
	const to = req.body.To;
	const body = req.body.Body;

	// session for current user
	const projectId = await sessionClient.getProjectId();
	const sessionPath = sessionClient.projectAgentSessionPath(projectId, from);

	// query dialogflow
	const response = await sessionClient.detectIntent({
		session: sessionPath,
		queryInput: {
			text: {
				text: body,
				languageCode: 'en-US',
			}
		}
	});


	// handle emi due date action
	if(response[0].queryResult.action == 'emi.due-date') {
		let dueDate = new Date();
		dueDate.setTime(dueDate.getTime() + 5*24*60*60*1000);
		
		let dueAmount = "$200";

		await twilioClient.messages.create({
			from: to,
			to: from,
			body: `Your next emi of ${dueAmount} is on ${dueDate.toDateString()}.`
		});

		res.status(200).end();
		return
	}

	// relay message sent by dialogflow directly to user
	// message can be in two formats
	// 1) Normal String response
	// 2) Json Object with url and text properies
	// 		url: publically accessible url of image
	// 		text: additional text
	const messages = response[0].queryResult.fulfillmentMessages;
	for (const message of messages) {

		// normal text message
		if(message.text) {
			await twilioClient.messages.create({
				from: to,
				to: from,
				body: message.text.text[0],
			});
		}

		// response payload
		if(message.payload) {
			let url = '';
			let text = '';

			if(message.payload.fields.media_url) {
				url = message.payload.fields.media_url.stringValue;	
			}

			if(messages.payload.fields.text) {
				text = message.payload.fields.text.stringValue
			}

			await twilioClient.messages.create({
				from: to,
				to: from,
				body: text,
				mediaUrl: url,
			});
		}
	}

	res.status(200).end();
});

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});