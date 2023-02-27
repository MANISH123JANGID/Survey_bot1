// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { MessageFactory, CardFactory } = require('botbuilder');
const newCard= require('../resources/newCard.json');
const {saveEducationSurvey}= require('../services/axios');
const {
    AttachmentPrompt,
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    ConfirmPrompt,
    DialogSet,
    DialogTurnStatus,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');
const { Channels } = require('botbuilder-core');

const Education= require('../educationProfile')

// const{rootDialog,ROOT_DIALOG}=require('./rootdialog');

const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const EDUCATIONAL_DIALOG = 'EDUCATIONAL_DIALOG';
const FAMILY_TYPE= 'FAMILY_TYPE';
const NUM_OF_MEMBERS = 'NUM_OF_MEMBERS';

class EducationalDialog extends ComponentDialog {
    constructor(){
        super(EDUCATIONAL_DIALOG);

        // this.addDialog(new rootDialog(ROOT_DIALOG));

        this.addDialog(new TextPrompt(NAME_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT));
        this.addDialog(new ChoicePrompt(FAMILY_TYPE));
        this.addDialog(new NumberPrompt(NUM_OF_MEMBERS));


        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.startSurveyStep.bind(this),
            this.startOrCancelStep.bind(this),
            this.qualification.bind(this),
            this.CollegeSchoolName.bind(this),
            this.gradesOrPercent.bind(this),
            this.placed.bind(this),
            this.InvestedAmount.bind(this),
            this.ExpectedPackage.bind(this),
            this.Satisfied.bind(this),
            this.Recommended.bind(this),
            this.GiveStars.bind(this),
            this.summaryStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(context, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(context);
        const result =await dialogContext.continueDialog();
        if(result.status===DialogTurnStatus.empty){
            await dialogContext.beginDialog(this.id);
        }

    }

    async startSurveyStep(step){
        // const cardPrompt= MessageFactory.text('helo');
        // cardPrompt.attachments= [CardFactory.adaptiveCard(newCard)];
        // console.log(cardPrompt.attachments);
        // return await step.prompt( cardPrompt);
        return await step.prompt(CHOICE_PROMPT,{
            prompt:"Hey! Welcome to the Educational Survey.Please select any option.",
            choices: ChoiceFactory.toChoices(['Start-Survey','Cancel'])
        })
    }

    async startOrCancelStep(step) {
        if(step.result.value==='Start-Survey'){
            const promptOptions= {prompt:'Please enter your name.', retryPrompt: 'Please enter name in valid format'}
            return await step.prompt(NAME_PROMPT,promptOptions)
        }else{
            return await step.cancelAllDialogs();
        }
    }

    async qualification(step){
        step.values.name= step.result;
        return await step.prompt(FAMILY_TYPE,{
            prompt:`Great ${step.result}, You are good to go! \n What is your highest qualification?`,
            choices: ChoiceFactory.toChoices(['Primary Education','Secondary Education','High School','Bachelors','Masters','Doctorate'])
        })
    }

    async CollegeSchoolName(step){
        step.values.qualification=step.result

        return await step.prompt(NAME_PROMPT,{
            prompt:'Enter the name of your College/University/School/Others.'
        }) 
    }

    async gradesOrPercent(step){
        step.values.nameofCollege= step.result;
        return await step.prompt(NUM_OF_MEMBERS,`${step.values.name}, Enter the Grade or Percentage you got.`);
    }

    async placed(step){
        step.values.gradesOrPercent= step.result;
        return await step.prompt(CONFIRM_PROMPT,'Did you get a placement?');
    }

    async InvestedAmount(step){
        step.values.placedBool= step.result;
        return await step.prompt(FAMILY_TYPE,{
            prompt:`How much you spent for your studies?`,
            choices: ChoiceFactory.toChoices(['Below ₹3 Lakh','₹3-5 Lakh','₹5-10 Lakh','₹10-15 Lakh','₹15-20 Lakh','₹20-30 Lakh','Above ₹30 Lakh'])
        })
    }

     async ExpectedPackage(step){
        step.values.InvestedAmount= step.result;
        return await step.prompt(CONFIRM_PROMPT,'did you get the expected package?');
    }

    async Satisfied(step){
        step.values.expectedBool= step.result;
        return await step.prompt(CONFIRM_PROMPT,'Are you satisfied by your learning and growth?');
    }

     async Recommended(step){
        step.values.satisfyBool= step.result;
        return await step.prompt(CONFIRM_PROMPT,'Will you recommend others to study in your college or university?');
    }

     async GiveStars(step){
        step.values.RecommendedBool= step.result;
        return await step.prompt(FAMILY_TYPE,{
            prompt:`Give rating to your university (out of 5)`,
            choices: ChoiceFactory.toChoices(['1 STAR','2 STAR','3 STAR','4 STAR','4.5 STAR','5 STAR'])
        })
    }

    async summaryStep(step) {
        step.values.Stars= step.result;
        console.log(step.values)

        const EducationProfile= new Education(step.values.name,step.values.qualification.value,step.values.nameofCollege,step.values.gradesOrPercent,step.values.placedBool,step.values.InvestedAmount.value,step.values.expectedBool,step.values.satisfyBool,step.values.RecommendedBool,step.values.Stars.value);
        const finalMesage= `Great ${EducationProfile.Name}, You have successfully completed the survey! 
        We have your EducationProfile as given below:\n 
        Name                    :   ${EducationProfile.Name} \n
        Highest Qualification   :   ${EducationProfile.qualification} \n
        College/University/School:  ${EducationProfile.nameofCollege} \n
        Grades/Percentage       :   ${EducationProfile.gradesOrPercent}\n
        Placed                  :   ${EducationProfile.placedBool}\n
        Invested Amount         :   ${EducationProfile.InvestedAmount}\n
        Got Expected Package    :   ${EducationProfile.ExpectedPackageBool}\n
        Satisfied with Learning :   ${EducationProfile.SatisfiedBool}\n
        Recommend to others     :   ${EducationProfile.RecommendedBool} \n
        Rating                  :   ${EducationProfile.GiveStars}\n
        \n
        Thank you, Mr.${EducationProfile.Name} for participating in survey. `

        const saved= await saveEducationSurvey(step.values.name,step.values.qualification.value,step.values.nameofCollege,step.values.gradesOrPercent,step.values.placedBool,step.values.InvestedAmount.value,step.values.expectedBool,step.values.satisfyBool,step.values.RecommendedBool,step.values.Stars.value)
        
        const dataSaved= 'Your survey has been saved'

        if(saved){
            await step.context.sendActivity(dataSaved)
        }

        await step.context.sendActivity(finalMesage);

        return await step.endDialog();
    }
}
module.exports = {EducationalDialog,EDUCATIONAL_DIALOG}
