
/*
{
  "employee": "string",
  "startDate": "2025-07-07",
  "endDate": "2025-07-07",
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
  "comment": "string"
}
 */


export class CreateAgingStage {
    constructor(
        employee = null,
        startDate = null,
        endDate = null,
        containerType = null,
        material = null,
        containerCode = null,
        averageTemperature = 0.0,
        volume = 0.0,
        duration = 0,
        frequency = 0,
        batonnage = 0.0,
        refills = 0,
        rackings = 0,
        purpose = null,
        comment = null
    ) {
        this.employee = employee; // Employee responsible for the aging stage
        this.startDate = startDate; // Start date of the aging stage
        this.endDate = endDate; // End date of the aging stage
        this.containerType = containerType; // Type of container used for aging
        this.material = material; // Material of the container
        this.containerCode = containerCode; // Code or identifier for the container
        this.averageTemperature = averageTemperature; // Average temperature during aging
        this.volume = volume; // Volume of wine in the container
        this.duration = duration; // Duration of the aging stage in days
        this.frequency = frequency; // Frequency of monitoring or actions during aging
        this.batonnage = batonnage; // Amount of batonnage performed (stirring)
        this.refills = refills; // Number of refills during aging
        this.rackings = rackings; // Number of rackings performed
        this.purpose = purpose; // Purpose of the aging stage (e.g., flavor development)
        this.comment = comment; // Additional comments or notes about the aging stage
    }

}