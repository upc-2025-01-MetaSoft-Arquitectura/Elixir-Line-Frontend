
/*
{
  "employee": "string",
  "startDate": "2025-07-03",
  "endDate": "2025-07-03",
  "filterType": "string",
  "filterMedium": "string",
  "porosity": 0.1,
  "initialTurbidity": 0.1,
  "finalTurbidity": 0.1,
  "temperature": 0.1,
  "pressure": 0.1,
  "filteredVolume": 0.1,
  "sterileFiltration": true,
  "changedFiltration": true,
  "changeReason": "string",
  "comment": "string",
  "completionStatus": "COMPLETED"
}
 */

export class UpdateFiltrationStageEntity {

    constructor(
        {
            employee,
            startDate,
            endDate,
            filterType,
            filterMedium,
            porosity,
            initialTurbidity,
            finalTurbidity,
            temperature,
            pressure,
            filteredVolume,
            sterileFiltration,
            changedFiltration,
            changeReason,
            comment,
            completionStatus
        }
    ) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.filterType = filterType;
        this.filterMedium = filterMedium;
        this.porosity = porosity;
        this.initialTurbidity = initialTurbidity;
        this.finalTurbidity = finalTurbidity;
        this.temperature = temperature;
        this.pressure = pressure;
        this.filteredVolume = filteredVolume;
        this.sterileFiltration = sterileFiltration;
        this.changedFiltration = changedFiltration;
        this.changeReason = changeReason;
        this.comment = comment;
        this.completionStatus = completionStatus;
    }

}