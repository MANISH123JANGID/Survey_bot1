const educationModel= require('../Models/educationalsurvey');

const familyModel= require('../Models/familysurvey');

const familySurveyController= async(req,res) => {
    try{
    const {name,familyType,numOfMembers,belowAgeOf18,aboveAgeOf18,numOfEmployed,numOfMales,numOfFemales,religion,caste,FamilyIncome}=req.body;

    const newFamilySurvey= new familyModel({name,familyType,numOfMembers,belowAgeOf18,aboveAgeOf18,numOfEmployed,numOfMales,numOfFemales,religion,caste,FamilyIncome});

    const isSaved= await newFamilySurvey.save();

    if(isSaved){
        return res.status(201).json({message:'FamilyProfile saved successfully'})
    }
}catch(err){
    console.log(err);
}
    
}

const educationSurveyController= async(req,res) => {
    try{
        const{name,qualification,collegeSchoolName,gradesOrPercent,placed,investedAmount,expectedPackage,satisfied,recommended,rating}= req.body;

        const newEducationSurvey= new educationModel({name,qualification,collegeSchoolName,gradesOrPercent,placed,investedAmount,expectedPackage,satisfied,recommended,rating});
    
        const isSaved= await newEducationSurvey.save();
        if(isSaved){
            return res.status(201).json({message:'Data saved successfully'})
        }
    }catch(err){
        console.log(err);
    }   
}

module.exports={familySurveyController,educationSurveyController};