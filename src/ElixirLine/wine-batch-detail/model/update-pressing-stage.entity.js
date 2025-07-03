
/*
{
  "employee": "string",
  "startDate": "2025-07-03",
  "endDate": "2025-07-03",
  "pressType": "string",
  "pressure": 0.1,
  "duration": 1073741824,
  "pomadeWeight": 0.1,
  "yield": 0.1,
  "mustUsage": "string",
  "comment": "string",
  "completionStatus": "COMPLETED"
}
 */
class UpdatePressingStageEntity {

    constructor(
        {
            employee,
            startDate,
            endDate,
            pressType,
            pressure,
            duration,
            pomadeWeight,
            mustYield,
            mustUsage,
            comment,
            completionStatus
        }
    ) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.pressType = pressType;
        this.pressure = pressure;
        this.duration = duration;
        this.pomadeWeight = pomadeWeight;
        this.mustYield = mustYield;
        this.mustUsage = mustUsage;
        this.comment = comment;
        this.completionStatus = completionStatus;
    }

}