

/*
{
  "employee": "string",
  "startDate": "2025-07-06",
  "endDate": "2025-07-06",
  "pressType": "string",
  "pressure": 0.1,
  "duration": 1073741824,
  "pomadeWeight": 0.1,
  "yield": 0.1,
  "mustUsage": "string",
  "comment": "string"
}
 */

export class CreatePressingStage {

    constructor(
        {
            employee = null,
            startDate = null,
            endDate = null,
            pressType = null,
            pressure = 0.0,
            duration = 0, // Duration in seconds
            pomadeWeight = 0.0, // Weight of the pomace in kg
            mustYield = 0.0, // Yield percentage
            mustUsage = null, // Usage of the must
            comment = null
        }
    )
    {
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
    }

}