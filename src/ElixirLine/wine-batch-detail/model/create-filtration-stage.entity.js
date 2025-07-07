
/*
{
  "employee": "string",
  "startDate": "2025-07-07",
  "endDate": "2025-07-07",
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
  "comment": "string"
}
*/



export class CreateFiltrationStage {

    constructor(
        {
            employee = null,
            startDate = null,
            endDate = null,
            filterType = null,
            filterMedium = null,
            porosity = 0.0,
            initialTurbidity = 0.0,
            finalTurbidity = 0.0,
            temperature = 0.0,
            pressure = 0.0,
            filteredVolume = 0.0,
            sterileFiltration = false,
            changedFiltration = false,
            changeReason = null,
            comment = null
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
    }

}