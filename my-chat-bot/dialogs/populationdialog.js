// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { MessageFactory } = require('botbuilder');
const{saveFamilyProfile} = require('../services/axios')
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
const FamilyProfile = require('../familyProfile');

const{rootDialog,ROOT_DIALOG}=require('./rootdialog');

const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const POPULATION_DIALOG = 'POPULATION_DIALOG';
const FAMILY_TYPE= 'FAMILY_TYPE';
const NUM_OF_MEMBERS = 'NUM_OF_MEMBERS';

class PopulationDialog extends ComponentDialog {
    constructor(){
        super(POPULATION_DIALOG);

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
            this.familyType.bind(this),
            this.numOfMembers.bind(this),
            this.belowAgeOf18.bind(this),
            this.howManyEmployed.bind(this),
            this.noOfMales.bind(this),
            this.religion.bind(this),
            this.caste.bind(this),
            this.familyIncome.bind(this),
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
        return await step.prompt(CHOICE_PROMPT,{
            prompt:"Hey! Welcome to the Population Survey.Please select any option.",
            choices: ChoiceFactory.toChoices(['Start-Survey','Cancel'])
        })
    }

    async startOrCancelStep(step) {
        if(step.result.value==='Start-Survey'){
            const promptOptions= {prompt:'Please enter your name.', retryPrompt: 'Please enter name in valid format'}
            return await step.prompt(NAME_PROMPT,promptOptions)
        }else{
            console.log("kya");
            return await step.cancelAllDialogs();
        }
    }
    async familyType(step){
        step.values.name= step.result;
        return await step.prompt(FAMILY_TYPE,{
            prompt:`Great ${step.result}, You are good to go! \n Select the type of family`,
            choices: ChoiceFactory.toChoices(['NUCLEAR-FAMILY','JOINT-FAMILY',])
        })
    }
    async numOfMembers(step){
        step.values.familyType= step.result;
        return await step.prompt(NUM_OF_MEMBERS,`${step.values.name}, Enter the number of members in your family.`);
    }
    async belowAgeOf18(step){
        step.values.numOfMembers= step.result;
        return await step.prompt(NUMBER_PROMPT,'How many are below the age of 18?');
    }
    async howManyEmployed(step){
        step.values.belowAgeOf18= step.result;
        step.values.aboveAgeOf18= step.values.numOfMembers-step.values.belowAgeOf18;
        return await step.prompt(NUMBER_PROMPT,'How many are Employed or working?')
    }
    async noOfMales(step){
        step.values.Employed= step.result;
        return await step.prompt(NUMBER_PROMPT,'Number of males in the family');
    }
    async religion(step){
        step.values.numOfMales= step.result;
        step.values.numOfFemales= step.values.numOfMembers- step.values.numOfMales;
        return await step.prompt(CHOICE_PROMPT,{
            prompt:"Please select your religion from given choices.",
            choices: ChoiceFactory.toChoices(['Hinduism','Islam','Sikhism','Christianity','Jainism','Buddhism ','Tribal-Religion','No religion'])
        })
    }
    async caste(step){
        step.values.religion= step.result;
        return await step.prompt(NAME_PROMPT,'Please enter your caste.')
    }
    async familyIncome(step){
        step.values.caste= step.result;
        return await step.prompt(CHOICE_PROMPT,{
            prompt:"Please select income range of your family(per annum).",
            choices: ChoiceFactory.toChoices(['Upto ₹2.5 Lakh','₹2.5-5 Lakh','₹5-10 Lakh','₹10-20 Lakh','₹20-50 Lakh','₹50-99 Lakh','₹1 Crore or above'])
        })
    }
    async summaryStep(step) {
        step.values.familyIncome= step.result;
        console.log(step.values)

        const familyProfile= new FamilyProfile(step.values.name,step.values.familyType.value,step.values.numOfMembers,step.values.belowAgeOf18,step.values.aboveAgeOf18,step.values.Employed,step.values.numOfMales,step.values.numOfFemales,step.values.caste,step.values.religion.value,step.values.familyIncome.value);

        const finalMesage= `Great ${familyProfile.NameofHead}, You have successfully completed the survey! 
        We have your familyProfile as given below:\n 
        Name of Head of Family  :   ${familyProfile.NameofHead} \n
        Type of Family          :   ${familyProfile.familyType} \n
        Total Members in Family :   ${familyProfile.numberOfMembers}\n
        Members(below age of 18):   ${familyProfile.numBelow18}\n
        Members(above age of 18):   ${familyProfile.numAbove18}\n
        Employed Members        :   ${familyProfile.numOfEmployed}\n
        Number of Males         :   ${familyProfile.numOfMales}\n
        Number of Females       :   ${familyProfile.numOfFemales} \n
        Caste                   :   ${familyProfile.Caste}\n
        Religion                :   ${familyProfile.Religion}\n
        Family Income(₹)        :   ${familyProfile.FamilyIncome} per annum\n
        \n
        Thank you, Mr.${familyProfile.NameofHead} for participating in survey. `
        
        console.log(step.values.name,step.values.familyType.value,
            step.values.numOfMembers,step.values.belowAgeOf18,
            step.values.aboveAgeOf18,step.values.Employed,
            step.values.numOfMales,step.values.numOfFemales,step.values.caste,step.values.religion.value,
            step.values.familyIncome.value)

        const saved= await saveFamilyProfile(step.values.name,step.values.familyType.value,
            step.values.numOfMembers,step.values.belowAgeOf18,
            step.values.aboveAgeOf18,step.values.Employed,
            step.values.numOfMales,step.values.numOfFemales,step.values.religion.value,step.values.caste,
            step.values.familyIncome.value);
        
        const dataSaved= 'Your survey has been saved'

        if(saved){
            await step.context.sendActivity(dataSaved);
        }

        await step.context.sendActivity(finalMesage);



        return await step.endDialog();
    }
}

module.exports = {PopulationDialog,POPULATION_DIALOG}
