
/*
{
  "employee": "string",
  "startDate": "2025-07-03",
  "endDate": "2025-07-03",
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
  "comment": "string",
  "completionStatus": "COMPLETED"
}
 */

class UpdateCorrectionStageEntity {

    constructor(
        {
            employee,
            startDate,
            endDate,
            initialSugarLevel,
            finalSugarLevel,
            addedSugar,
            initialPH,
            finalPH,
            acidType,
            addedAcid,
            addedSulphites,
            nutrients,
            justification,
            comment,
            completionStatus
        }
    ) {
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
        this.nutrients = nutrients;
        this.justification = justification;
        this.comment = comment;
        this.completionStatus = completionStatus;
    }


}