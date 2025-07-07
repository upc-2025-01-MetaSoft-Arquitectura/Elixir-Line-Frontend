


/*
{
  "employee": "string",
  "startDate": "2025-07-07",
  "endDate": "2025-07-07",
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
  "comment": "string"
}
 */

export class CreateBottlingStage {

    constructor({
        employee = null,
        startDate = null,
        endDate = null,
        bottlingLine = null,
        filledBottles = 0,
        bottleVolume = 750, // Default to 750ml
        totalVolume = 0, // Calculated as filledBottles * bottleVolume
        sealingType = null,
        vineyardCode = null,
        temperature = null,
        filteredBeforeBottling = false,
        labelsAtThisStage = false,
        capsuleOrSealApplication = false,
        comment = null
    }) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.bottlingLine = bottlingLine;
        this.filledBottles = filledBottles;
        this.bottleVolume = bottleVolume;
        this.totalVolume = totalVolume || (filledBottles * bottleVolume / 1000); // Convert to liters
        this.sealingType = sealingType;
        this.vineyardCode = vineyardCode;
        this.temperature = temperature;
        this.filteredBeforeBottling = filteredBeforeBottling;
        this.labelsAtThisStage = labelsAtThisStage;
        this.capsuleOrSealApplication = capsuleOrSealApplication;
        this.comment = comment;
    }




}