const axios = require('axios');

const saveFamilyProfile = async(name,familyType,numOfMembers,belowAgeOf18,aboveAgeOf18,numOfEmployed,numOfMales,numOfFemales,religion,caste,FamilyIncome)=>{
        const data= await axios.post('http://localhost:3500/api/messages/familySurvey',{
            name,familyType,numOfMembers,belowAgeOf18  ,aboveAgeOf18,
    numOfEmployed,numOfMales,numOfFemales,religion,caste,FamilyIncome
        })
        return data.data;
}

const saveEducationSurvey= async(name,qualification,collegeSchoolName,gradesOrPercent,
        placed,investedAmount,expectedPackage,satisfied,recommended,rating)=>{
         const data =await axios.post('http://localhost:3500/api/messages/educationSurvey',{
            name,qualification,collegeSchoolName,gradesOrPercent,
            placed,investedAmount,expectedPackage,satisfied,recommended,rating
        })
        return data.data;
}

module.exports= {saveEducationSurvey,saveFamilyProfile}
