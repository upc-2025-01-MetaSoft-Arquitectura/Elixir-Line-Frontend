/*
{
  "id": 1,
  "batchId": 10,
  "employee": "Luis Carlos Prada Naez",
  "startDate": "2025-06-01",
  "endDate": "2025-06-02",
  "yeastUsed": 150,
  "fermentationType": "Alcoholic",
  "initialSugarLevel": 22,
  "finalSugarLevel": 5,
  "initialPH": 3.5,
  "finalPH": 3.2,
  "maxTemperature": 30,
  "minTemperature": 15,
  "tankCode": "TANK-01",
  "comment": "Fermentación realizada con éxito.",
  "completionStatus": "NOT_COMPLETED",
  "currentStage": "FERMENTATION",
  "completedAt": null,
  "dataHash": null
}
 */

export class FermentationStage {

    constructor({
        id = null,
        batchId = null,
        employee = null,
        startDate = null,
        endDate = null,
        yeastUsed = 0, // Cantidad de levadura en gramos
        fermentationType = null, // Tipo de fermentación (e.g., Alcohólica, Maloláctica)
        initialSugarLevel = null, // Nivel de azúcar inicial en g/L
        finalSugarLevel = null, // Nivel de azúcar final en g/L
        initialPH = null, // pH inicial
        finalPH = null, // pH final
        maxTemperature = null, // Temperatura máxima en grados Celsius
        minTemperature = null, // Temperatura mínima en grados Celsius
        tankCode = null, // Código del tanque utilizado
        comment = null, // Comentarios adicionales
        completionStatus = 'NOT_COMPLETED', // Estado de finalización
        currentStage = 'FERMENTATION', // Siempre 'FERMENTATION' para esta clase
        completedAt = null, // Fecha de finalización
        dataHash = null // Hash para integridad de datos
    }) {
        this.id = id;
        this.batchId = batchId;
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.yeastUsed = yeastUsed; // En gramos
        this.fermentationType = fermentationType; // Tipo de fermentación
        this.initialSugarLevel = initialSugarLevel; // En g/L
        this.finalSugarLevel = finalSugarLevel; // En g/L
        this.initialPH = initialPH; // pH inicial
        this.finalPH = finalPH; // pH final
        this.maxTemperature = maxTemperature; // Temperatura máxima en °C
        this.minTemperature = minTemperature; // Temperatura mínima en °C
        this.tankCode = tankCode; // Código del tanque utilizado
        this.comment = comment; // Comentarios adicionales
        this.completionStatus = completionStatus; // Estado de finalización
        this.currentStage = currentStage; // Siempre 'FERMENTATION'
        this.completedAt = completedAt; // Fecha de finalización
        this.dataHash = dataHash; // Para integridad de datos
    }

}
