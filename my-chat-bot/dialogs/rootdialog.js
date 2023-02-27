const{
    ComponentDialog,
    ChoiceFactory,
    ChoicePrompt,
    ConfirmPrompt,
    TextPrompt,
    NumberPrompt,
    AttachmentPrompt,
    DialogSet,
    WaterfallDialog,
    DialogTurnStatus
}= require('botbuilder-dialogs');

const{EducationalDialog, EDUCATIONAL_DIALOG}= require('./educationaldialog');
const{PopulationDialog, POPULATION_DIALOG}=require('./populationdialog');

const ROOT_DIALOG= 'ROOT_DIALOG';
const WATERFALL_DIALOG= 'WATERFALL_DIALOG';
const CHOICE_PROMPT= 'CHOICE_PROMPT';

class rootDialog extends ComponentDialog{
    constructor(){
        super(ROOT_DIALOG);
        
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new EducationalDialog(EDUCATIONAL_DIALOG));
        this.addDialog(new PopulationDialog(POPULATION_DIALOG));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG,[
            this.firstStep.bind(this),
            this.secondStep.bind(this),
        ]));
        this.initialDialogId= WATERFALL_DIALOG;
    }

    async run(turnContext, accessor) {
        const dialogSet= new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext=await dialogSet.createContext(turnContext);
        const results= await dialogContext.continueDialog();
        if(results.status===DialogTurnStatus.empty){
            await dialogContext.beginDialog(this.id);
        }
    }
    async firstStep(step){
        return await step.prompt(CHOICE_PROMPT,{
            prompt:"Hey User! Welcome to the Survey-Bot.Please select any one survey.",
            choices: ChoiceFactory.toChoices(['Population-Survey', 'Educational-Survey'])
        });
    }

    async secondStep(step){
        if(step.result.value=== 'Population-Survey'){
            return await step.beginDialog(POPULATION_DIALOG);
        }else if(step.result.value=== 'Educational-Survey'){
            return await step.beginDialog(EDUCATIONAL_DIALOG);
        }
    }
}

module.exports= {rootDialog,ROOT_DIALOG}