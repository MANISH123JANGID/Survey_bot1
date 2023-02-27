// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');

class Bot extends ActivityHandler {
    constructor(userState, conversationState, dialog) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.conversationState= conversationState;
        this.userState= userState;
        this.dialog= dialog;
        this.dialogState= this.conversationState.createProperty('DialogState')


        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMembersAdded(async (context, next) => {
            await this.dialog.run(context, this.dialogState)
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });


        this.onMessage(async (context, next) => {
            await this.dialog.run(context, this.dialogState);
            await next();
        });
    }

    async run(context){
        await super.run(context);

        await this.conversationState.saveChanges(context,false);
        await this.userState.saveChanges(context,false);
    }
}

module.exports = Bot;
