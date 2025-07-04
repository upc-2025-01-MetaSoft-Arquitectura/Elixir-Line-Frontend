
/*
{
  "employee": "string",
  "startDate": "2025-07-03",
  "endDate": "2025-07-03",
  "methodUsed": "string",
  "initialTurbidity": 0.1,
  "finalTurbidity": 0.1,
  "volume": 0.1,
  "temperature": 0.1,
  "duration": 1073741824,
  "clarifyingAgents": {
    "additionalProp1": 0.1,
    "additionalProp2": 0.1,
    "additionalProp3": 0.1
  },
  "comment": "string",
  "completionStatus": "COMPLETED"
}
 */

export class UpdateClarificationStageEntity{

    constructor(
        {
            employee,
            startDate,
            endDate,
            methodUsed,
            initialTurbidity,
            finalTurbidity,
            volume,
            temperature,
            duration,
            clarifyingAgents,
            comment,
            completionStatus
        }
    ) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.methodUsed = methodUsed;
        this.initialTurbidity = initialTurbidity;
        this.finalTurbidity = finalTurbidity;
        this.volume = volume;
        this.temperature = temperature;
        this.duration = duration;
        this.clarifyingAgents = clarifyingAgents;
        this.comment = comment;
        this.completionStatus = completionStatus;
    }

}