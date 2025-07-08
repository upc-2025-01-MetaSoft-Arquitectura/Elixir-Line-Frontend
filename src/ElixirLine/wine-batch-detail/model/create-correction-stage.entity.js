
/*
{
  "employee": "string",
  "startDate": "2025-07-06",
  "endDate": "2025-07-06",
  "initialSugarLevel": 0.1,
  "finalSugarLevel": 0.1,
  "addedSugar": 0.1,
  "initialPH": 0.1,
  "finalPH": 0.1,
  "acidType": "string",
  "addedAcid": 0.1,
  "addedSulphites": 0.1,
  "nutrients": [
    "string"
  ],
  "justification": "string",
  "comment": "string"
}
 */


export class CreateCorrectionStage {

    constructor({
        employee = null,
        startDate = null,
        endDate = null,
        initialSugarLevel = 0.0,
        finalSugarLevel = 0.0,
        addedSugar = 0.0,
        initialPH = 0.0,
        finalPH = 0.0,
        acidType = null,
        addedAcid = 0.0,
        addedSulphites = 0.0,
        nutrients = [],
        justification = null,
        comment = null
    }) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.initialSugarLevel = initialSugarLevel;
        this.finalSugarLevel = finalSugarLevel;
        this.addedSugar = addedSugar;
        this.initialPH = initialPH;
        this.finalPH = finalPH;
        this.acidType = acidType;
        this.addedAcid = addedAcid;
        this.addedSulphites = addedSulphites;
        this.nutrients = nutrients; // Array of nutrient names
        this.justification = justification;
        this.comment = comment;
    }

}