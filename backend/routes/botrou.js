const express= require('express');

const router= express.Router();

const{familySurveyController, educationSurveyController}=require('../controller/dialog')

router.post('/familySurvey',familySurveyController);

router.post('/educationSurvey',educationSurveyController);

module.exports = router;
