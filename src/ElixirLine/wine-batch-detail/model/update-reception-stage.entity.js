
/*
{
  "employee": "string",
  "startDate": "2025-07-03",
  "endDate": "2025-07-03",
  "sugarLevel": 0.1,
  "pHLevel": 0.1,
  "temperature": 0.1,
  "quantityKg": 0.1,
  "comment": "string",
  "completionStatus": "COMPLETED"
}
 */

export class UpdateReceptionStageEntity {

    constructor(
        {
            employee,
            startDate,
            endDate,
            sugarLevel,
            pHLevel,
            temperature,
            quantityKg,
            comment,
            completionStatus
        }
    ) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sugarLevel = sugarLevel;
        this.pHLevel = pHLevel;
        this.temperature = temperature;
        this.quantityKg = quantityKg;
        this.comment = comment;
        this.completionStatus = completionStatus;
    }
}