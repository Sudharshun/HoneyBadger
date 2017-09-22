/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');
const answers = require('./recipes');

const APP_ID =  undefined;

const languageStrings = {
    'en': {
        translation: {
            ANSWERS: answers.ANSWERS_EN_US,
            SKILL_NAME: 'Honey Badger',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like,Honey Badger what\'s intel? ... Now, what can I help you with?",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Instructions for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s intel, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMPT: "You can say things like, what\'s intel,who is the retroguy or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            ANSWER_REPEAT_MESSAGE: 'Try saying repeat.',
            ANSWER_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            ANSWER_NOT_FOUND_WITH_ITEM_NAME: 'the answer for %s. ',
            ANSWER_NOT_FOUND_WITHOUT_ITEM_NAME: 'that answer.',
            ANSWER_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'en-US': {
        translation: {
            ANSWERS: answers.ANSWERS_EN_US,
            SKILL_NAME: 'American Honey Badger',
        },
    },
    'en-GB': {
        translation: {
            ANSWERS: answers.ANSWERS_EN_GB,
            SKILL_NAME: 'British Honey Badger',
        },
    },
};

const handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'QuestionIntent': function () {
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myAnswers = this.t('ANSWERS');
        const answer = myAnswers[itemName];

        if (answer) {
            this.attributes.speechOutput = answer;
            this.attributes.repromptSpeech = this.t('ANSWER_REPEAT_MESSAGE');

            this.response.speak(recipe).listen(this.attributes.repromptSpeech);
            this.response.cardRenderer(cardTitle, answer);
            this.emit(':responseReady');
        } else {
            let speechOutput = this.t('ANSWER_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('ANSWER_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('ANSWER_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('ANSWER_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.response.speak(speechOutput).listen(repromptSpeech);
            this.emit(':responseReady');
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.RepeatIntent': function () {
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        console.log(`Session ended: ${this.event.request.reason}`);
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
