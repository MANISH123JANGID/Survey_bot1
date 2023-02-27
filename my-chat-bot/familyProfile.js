// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

class FamilyProfile {
    constructor(NameofHead,familyType,numberOfMembers,numBelow18,numAbove18,numOfEmployed,numOfMales,numOfFemales,Caste,Religion,FamilyIncome) {
        this.NameofHead= NameofHead;
        this.familyType= familyType;
        this.numberOfMembers= numberOfMembers;
        this.numBelow18= numBelow18;
        this.numAbove18= numAbove18;
        this.numOfEmployed=numOfEmployed;
        this.numOfMales= numOfMales;
        this.numOfFemales= numOfFemales;
        this.Caste=Caste;
        this.Religion=Religion;
        this.FamilyIncome=FamilyIncome;
    }
}

module.exports = FamilyProfile;
