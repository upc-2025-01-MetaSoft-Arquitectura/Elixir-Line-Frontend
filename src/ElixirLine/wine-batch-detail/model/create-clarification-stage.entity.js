
/*
{
  "employee": "string",
  "startDate": "2025-07-07",
  "endDate": "2025-07-07",
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
  "comment": "string"
}
 */
export class CreateClarificationStage {

    constructor({
        employee = null,
        startDate = null,
        endDate = null,
        methodUsed = null,
        initialTurbidity = 0.0,
        finalTurbidity = 0.0,
        volume = 0.0,
        temperature = 0.0,
        duration = 0,
        clarifyingAgents = {},
        comment = null
    }) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.methodUsed = methodUsed;
        this.initialTurbidity = initialTurbidity;
        this.finalTurbidity = finalTurbidity;
        this.volume = volume;
        this.temperature = temperature;
        this.duration = duration;
        this.clarifyingAgents = clarifyingAgents; // Object with agent names and their quantities
        this.comment = comment;
    }
}