class EducationProfile {
    constructor(Name,qualification,nameofCollege,gradesOrPercent,placedBool,InvestedAmount,ExpectedPackageBool,SatisfiedBool,RecommendedBool,GiveStars) {
        this.Name= Name;
        this.qualification= qualification;
        this.nameofCollege= nameofCollege;
        this.gradesOrPercent= gradesOrPercent;
        this.placedBool= placedBool;
        this.InvestedAmount= InvestedAmount;
        this.ExpectedPackageBool=ExpectedPackageBool;
        this.SatisfiedBool= SatisfiedBool;
        this.RecommendedBool= RecommendedBool;
        this.GiveStars=GiveStars;
    }
}

module.exports = EducationProfile;
