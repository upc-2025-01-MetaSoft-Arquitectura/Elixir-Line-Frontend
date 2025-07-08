
/*
{
  "id": 1,
  "batchId": 10,
  "employee": "Luis Carlos Prada Naez",
  "startDate": "2025-06-01",
  "endDate": "2025-06-02",
  "filterType": "Microfiltration",
  "filterMedium": "Polypropylene",
  "porosity": 0.2,
  "initialTurbidity": 5,
  "finalTurbidity": 0.5,
  "temperature": 20,
  "pressure": 1.5,
  "filteredVolume": 1000,
  "sterileFiltration": true,
  "changedFiltration": false,
  "changeReason": null,
  "comment": "Filtración realizada con éxito.",
  "completionStatus": "NOT_COMPLETED",
  "currentStage": "FILTRATION",
  "completedAt": null,
  "dataHash": null
}
 */

export class FiltrationStage {

    constructor({
        id = null,
        batchId = null,
        employee = null,
        startDate = null,
        endDate = null,
        filterType = null, // Tipo de filtración (e.g., Microfiltración, Ultrafiltración)
        filterMedium = null, // Medio filtrante (e.g., Polipropileno, Celulosa)
        porosity = null, // Porosidad del filtro en micrones
        initialTurbidity = null, // Turbidez inicial en NTU
        finalTurbidity = null, // Turbidez final en NTU
        temperature = null, // Temperatura durante la filtración en grados Celsius
        pressure = null, // Presión aplicada en bares
        filteredVolume = 0, // Volumen filtrado en litros
        sterileFiltration = false, // Indica si es filtración estéril
        changedFiltration = false, // Indica si se cambió el medio filtrante
        changeReason = null, // Motivo del cambio de filtración
        comment = null, // Comentarios adicionales
        completionStatus = 'NOT_COMPLETED', // Estado de finalización
        currentStage = 'FILTRATION', // Siempre 'FILTRATION' para esta clase
        completedAt = null, // Fecha de finalización
        dataHash = null // Hash para integridad de datos
    }) {
        this.id = id;
        this.batchId = batchId;
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.filterType = filterType;
        this.filterMedium = filterMedium;
        this.porosity = porosity; // En micrones
        this.initialTurbidity = initialTurbidity; // En NTU
        this.finalTurbidity = finalTurbidity; // En NTU
        this.temperature = temperature; // En °C
        this.pressure = pressure; // En bares
        this.filteredVolume = filteredVolume; // En litros
        this.sterileFiltration = sterileFiltration;
        this.changedFiltration = changedFiltration;
        this.changeReason = changeReason;
        this.comment = comment;
        this.completionStatus = completionStatus;
        this.currentStage = currentStage; // Siempre 'FILTRATION'
        this.completedAt = completedAt; // Fecha de finalización
        this.dataHash = dataHash; // Para integridad de datos
    }
}
