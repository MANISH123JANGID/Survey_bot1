const express = require('express');

const app = express();

require('dotenv').config();

app.use(express.json());

const router= require('./routes/botrou');

app.use('/api/messages',router);

const connectToDB= require('./db/connect') 

const start= async()=>{
    try{
        const connected= await connectToDB(process.env.MONGO_URI);
        if(connected){
            console.log('Successfully connected to Database');
        }else{
            throw new Error
        }
        app.listen(process.env.PORT, ()=>{
            console.log(`Server is listening on Port ${process.env.PORT}`)
        })
    }catch(err){
        console.log(err);
    }
}

start();