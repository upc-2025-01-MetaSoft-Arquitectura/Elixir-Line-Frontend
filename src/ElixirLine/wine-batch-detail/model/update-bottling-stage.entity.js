
/*
{
  "employee": "string",
  "startDate": "2025-07-03",
  "endDate": "2025-07-03",
  "bottlingLine": "string",
  "filledBottles": 1073741824,
  "bottleVolume": 0.1,
  "totalVolume": 0.1,
  "sealingType": "string",
  "vineyardCode": "string",
  "temperature": 0.1,
  "filteredBeforeBottling": true,
  "labelsAtThisStage": true,
  "capsuleOrSealApplication": true,
  "comment": "string",
  "completionStatus": "COMPLETED"
}
 */


export class UpdateBottlingStageEntity{

    constructor(
        {
            employee,
            startDate,
            endDate,
            bottlingLine,
            filledBottles,
            bottleVolume,
            totalVolume,
            sealingType,
            vineyardCode,
            temperature,
            filteredBeforeBottling,
            labelsAtThisStage,
            capsuleOrSealApplication,
            comment,
            completionStatus
        }
    ) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.bottlingLine = bottlingLine;
        this.filledBottles = filledBottles;
        this.bottleVolume = bottleVolume;
        this.totalVolume = totalVolume;
        this.sealingType = sealingType;
        this.vineyardCode = vineyardCode;
        this.temperature = temperature;
        this.filteredBeforeBottling = filteredBeforeBottling;
        this.labelsAtThisStage = labelsAtThisStage;
        this.capsuleOrSealApplication = capsuleOrSealApplication;
        this.comment = comment;
        this.completionStatus = completionStatus;
    }

}