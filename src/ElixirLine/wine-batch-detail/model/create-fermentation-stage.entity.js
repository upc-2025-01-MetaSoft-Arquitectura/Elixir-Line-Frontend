
/*
{
  "employee": "string",
  "startDate": "2025-07-06",
  "endDate": "2025-07-06",
  "yeastUsed": 0.1,
  "fermentationType": "string",
  "initialSugarLevel": 0.1,
  "finalSugarLevel": 0.1,
  "initialPH": 0.1,
  "finalPH": 0.1,
  "maxTemperature": 0.1,
  "minTemperature": 0.1,
  "tankCode": "string",
  "comment": "string"
}
 */

export class CreateFermentationStage {

    constructor({
        employee = null,
        startDate = null,
        endDate = null,
        yeastUsed = 0.1, // Default to 0.1g/L
        fermentationType = null,
        initialSugarLevel = 0.1, // Default to 0.1g/L
        finalSugarLevel = 0.1, // Default to 0.1g/L
        initialPH = 0.1, // Default to 0.1
        finalPH = 0.1, // Default to 0.1
        maxTemperature = 0.1, // Default to 0.1°C
        minTemperature = 0.1, // Default to 0.1°C
        tankCode = '',
        comment = ''
    }) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.yeastUsed = yeastUsed;
        this.fermentationType = fermentationType;
        this.initialSugarLevel = initialSugarLevel;
        this.finalSugarLevel = finalSugarLevel;
        this.initialPH = initialPH;
        this.finalPH = finalPH;
        this.maxTemperature = maxTemperature;
        this.minTemperature = minTemperature;
        this.tankCode = tankCode;
        this.comment = comment;
    }

}