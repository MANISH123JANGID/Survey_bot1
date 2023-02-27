const mongoose= require('mongoose')

const educationsSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    qualification:{
        type:String,
        enum:['Primary Education','Secondary Education','High School','Bachelors','Masters','Doctorate'],
    },
    collegeSchoolName:{
        type:String,
        required:true,
    }, 
    gradesOrPercent:{
        type:String,
        required:true,
    },
    placed:{
        type:String,
        required:true,
    },
    investedAmount:{
        type:String,
        enum:['Below ₹3 Lakh','₹3-5 Lakh','₹5-10 Lakh','₹10-15 Lakh','₹15-20 Lakh','₹20-30 Lakh','Above ₹30 Lakh']
    },
    expectedPackage:{
        type:String,
        required:true,
    },
    satisfied:{
        type:String,
        required:true,
    },
    recommended:{
        type:String,
        required:true,
    },
    rating:{
        type:String,
        enum:['1 STAR','2 STAR','3 STAR','4 STAR','4.5 STAR','5 STAR']
    }
},{timestamps:true})

module.exports= mongoose.model('education',educationsSchema);