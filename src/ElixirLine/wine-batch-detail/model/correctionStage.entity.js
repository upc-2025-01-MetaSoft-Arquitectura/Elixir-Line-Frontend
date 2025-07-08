
/*
{
  "id": 1,
  "batchId": 10,
  "employee": "Luis Carlos Prada Naez",
  "startDate": "2025-06-01",
  "endDate": "2025-06-02",
  "initialSugarLevel": 22,
  "finalSugarLevel": 5,
  "addedSugar": 2,
  "initialPH": 3.5,
  "finalPH": 3.2,
  "acidType": "Tartaric",
  "addedAcid": 1.5,
  "addedSulphites": 50,
  "nutrients": [
    "Nutrient A",
    "Nutrient B"
  ],
  "justification": "Adjustment for fermentation.",
  "comment": "Corrección realizada con éxito.",
  "completionStatus": "NOT_COMPLETED",
  "currentStage": "CORRECTION",
  "completedAt": null,
  "dataHash": null
}
 */

export class CorrectionStage {
    constructor({
        id = null,
        batchId = null,
        employee = null,
        startDate = null,
        endDate = null,
        initialSugarLevel = null, // Nivel de azúcar inicial en g/L
        finalSugarLevel = null, // Nivel de azúcar final en g/L
        addedSugar = 0, // Azúcar añadido en g/L
        initialPH = null, // pH inicial
        finalPH = null, // pH final
        acidType = null, // Tipo de ácido añadido (e.g., Tartárico)
        addedAcid = 0, // Cantidad de ácido añadido en g/L
        addedSulphites = 0, // Sulfitos añadidos en mg/L
        nutrients = [], // Nutrientes añadidos (e.g., lista de nombres)
        justification = null, // Justificación para la corrección
        comment = null, // Comentarios adicionales
        completionStatus = 'NOT_COMPLETED', // Estado de finalización
        currentStage = 'CORRECTION', // Siempre 'CORRECTION' para esta clase
        completedAt = null, // Fecha de finalización
        dataHash = null // Hash para integridad de datos
    }) {
        this.id = id;
        this.batchId = batchId;
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.initialSugarLevel = initialSugarLevel; // En g/L
        this.finalSugarLevel = finalSugarLevel; // En g/L
        this.addedSugar = addedSugar; // En g/L
        this.initialPH = initialPH; // pH inicial
        this.finalPH = finalPH; // pH final
        this.acidType = acidType; // Tipo de ácido añadido
        this.addedAcid = addedAcid; // En g/L
        this.addedSulphites = addedSulphites; // En mg/L
        this.nutrients = nutrients; // Lista de nutrientes añadidos
        this.justification = justification; // Justificación para la corrección
        this.comment = comment; // Comentarios adicionales
        this.completionStatus = completionStatus; // Estado de finalización
        this.currentStage = currentStage; // Siempre 'CORRECTION'
        this.completedAt = completedAt; // Fecha de finalización
        this.dataHash = dataHash; // Para integridad de datos
    }
}


