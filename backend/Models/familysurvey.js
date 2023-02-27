const mongoose= require('mongoose')

const familySchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    familyType:{
        type:String,
        enum:['NUCLEAR-FAMILY','JOINT-FAMILY'],
        required:true,
    },
    numOfMembers:{
        type:Number,
        required:true,
    },
    belowAgeOf18:{
        type:Number,
        required:true,
    },
    aboveAgeOf18:{
        type:Number,
        required:true,
    },
    numOfEmployed:{
        type:Number,
        required:true,
    },
    numOfMales:{
        type:Number,
        required:true,
    },
    numOfFemales:{
        type:Number,
        required:true,
    },
    religion:{
        type:String,
        required:true,
        enum:['Hinduism','Islam','Sikhism','Christianity','Jainism','Buddhism ','Tribal-Religion','No religion']
    },
    caste:{
        type:String,
        required:true,
    },
    familyIncome:{
        type:String,
        enum:['Upto ₹2.5 Lakh','₹2.5-5 Lakh','₹5-10 Lakh','₹10-20 Lakh','₹20-50 Lakh','₹50-99 Lakh','₹1 Crore or above']
    }
},{timestamps:true})

module.exports= mongoose.model('family',familySchema);