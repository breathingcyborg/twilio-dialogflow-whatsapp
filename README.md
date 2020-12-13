# Twilio Whatsapp dialogflow 
Example showing how to integrate, dialogflow with twilio.

## Setup
* Create dialogflow es agent.
* Create intent for dialogflow agent with name 'Emi Due', action 'emi.due-date',
  and few training pharses like 'when is my next emi?'. 'when is my next installment?' etc.
* Create google cloud service account, and download credentials.json
* Create twilio project
* Enable whatsapp sandbox for twilio (Dashboard > Programmable Messages > Try It Out > Try Whatsapp).
* Join twilio whatsapp sandbox by whatsapp message 'join sandbox-name' to twilio whatsapp sandbox phone number.
* Create .env file
* Copy content of .env-example to .env
* Set value of TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, GOOGLE_APPLICATION_CREDENTIALS in .env file

## Start node and ngrok

### Start node server
```
npm install
node ./index.js
```

### Start ngrok tunnel
```
ngrok http 3000
```

### Set twilio whatsapp sandbox callback url
From your twilio project set whatsapp message callback url to ngrok_url/whatsapp.

## Chat with the bot.
![Chat Screenshot](./screenshots/chat.png?raw=true "Chat Screenshot")