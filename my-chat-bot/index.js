const path = require('path');
const restify= require('restify');

// absolute path of the env file 
const ENV_FILE= path.join(__dirname,'.env');

const dotenv = require('dotenv');

// configuration of env file on the path 
dotenv.config({path: ENV_FILE});

// destructuring various classes required for the app from botbuilder
const{
    CloudAdapter,
    ConfigurationBotFrameworkAuthentication,
    UserState,
    ConversationState,
    MemoryStorage
}= require('botbuilder');

const server = restify.createServer();

server.use(restify.plugins.bodyParser())

server.listen(3978, ()=>{
    console.log(`\n${ server.name } listening to ${ server.url }.`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// creating the authentication object from the class by passing the required params
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env);

// adpater object to create the adapter for the bot 
const Adapter = new CloudAdapter(botFrameworkAuthentication);

// requiring the files required for creating bot object and the root dialog object and other dialog objects are
const Bot = require('./bots/bot');
const {rootDialog}= require('./dialogs/rootdialog');

// for handling the exceptions and errors which the bot logic cant handle
Adapter.onTurnError= async (context,error)=>{

    console.error(`Unhandler error: ${error}`);

    // sending the activity to the emulator 
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    )
    
    // sending message to the user 
    await context.sendActivity('The bot encountered an error or bug!');
    
    // deleting the context of the conversationstate
    await conversationState.delete(context);
}

// creating memory storage object to store the states
const memoryStorage= new MemoryStorage();

// userState to save the userstate
const userState = new UserState(memoryStorage);

const conversationState= new ConversationState(memoryStorage);

const rootdialog = new rootDialog();

const myBot = new Bot(userState, conversationState, rootdialog);

server.post('/api/messages', async (req,res)=>{
    await Adapter.process(req,res,(context)=>
        myBot.run(context));
});

