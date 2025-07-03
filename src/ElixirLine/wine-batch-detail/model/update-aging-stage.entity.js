

/*
{
  "employee": "string",
  "startDate": "2025-07-03",
  "endDate": "2025-07-03",
  "containerType": "string",
  "material": "string",
  "containerCode": "string",
  "averageTemperature": 0.1,
  "volume": 0.1,
  "duration": 1073741824,
  "frequency": 1073741824,
  "batonnage": 0.1,
  "refills": 1073741824,
  "rackings": 1073741824,
  "purpose": "string",
  "comment": "string",
  "completionStatus": "COMPLETED"
}
 */

class UpdateAgingStageEntity{

    constructor(
        {
            employee,
            startDate,
            endDate,
            containerType,
            material,
            containerCode,
            averageTemperature,
            volume,
            duration,
            frequency,
            batonnage,
            refills,
            rackings,
            purpose,
            comment,
            completionStatus
        }
    ) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.containerType = containerType;
        this.material = material;
        this.containerCode = containerCode;
        this.averageTemperature = averageTemperature;
        this.volume = volume;
        this.duration = duration;
        this.frequency = frequency;
        this.batonnage = batonnage;
        this.refills = refills;
        this.rackings = rackings;
        this.purpose = purpose;
        this.comment = comment;
        this.completionStatus = completionStatus;
    }

}