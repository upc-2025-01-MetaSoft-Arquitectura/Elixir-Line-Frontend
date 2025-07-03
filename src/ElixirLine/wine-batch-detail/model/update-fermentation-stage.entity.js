
/*
{
  "employee": "string",
  "startDate": "2025-07-03",
  "endDate": "2025-07-03",
  "yeastUsed": 0.1,
  "fermentationType": "string",
  "initialSugarLevel": 0.1,
  "finalSugarLevel": 0.1,
  "initialPH": 0.1,
  "finalPH": 0.1,
  "maxTemperature": 0.1,
  "minTemperature": 0.1,
  "tankCode": "string",
  "comment": "string",
  "completionStatus": "COMPLETED"
}
 */

class UpdateFermentationStageEntity {

    constructor(
        {
            employee,
            startDate,
            endDate,
            yeastUsed,
            fermentationType,
            initialSugarLevel,
            finalSugarLevel,
            initialPH,
            finalPH,
            maxTemperature,
            minTemperature,
            tankCode,
            comment,
            completionStatus
        }
    ) {
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
        this.completionStatus = completionStatus;
    }

}