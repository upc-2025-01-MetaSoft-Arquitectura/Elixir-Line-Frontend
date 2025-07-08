
/*
{
    "id": 1,
    "batchId": 10,
    "employee": "Luis Carlos Prada Naez",
    "startDate": "2025-06-01",
    "endDate": "2025-06-02",
    "methodUsed": "Centrifugation",
    "initialTurbidity": 10,
    "finalTurbidity": 1,
    "volume": 1000,
    "temperature": 20,
    "duration": 2,
    "clarifyingAgents": {
    "Bentonite": 5,
        "Gelatin": 2
},
    "comment": "Clarificación realizada con éxito.",
    "completionStatus": "NOT_COMPLETED",
    "currentStage": "CLARIFICATION",
    "completedAt": null,
    "dataHash": null
}
 */

export class ClarificationStage {
    constructor({
        id = null,
        batchId = null,
        employee = null,
        startDate = null,
        endDate = null,
        methodUsed = null, // Método de clarificación (e.g., Centrifugación, Filtración)
        initialTurbidity = null, // Turbidez inicial en NTU
        finalTurbidity = null, // Turbidez final en NTU
        volume = 0, // Volumen tratado en litros
        temperature = null, // Temperatura durante el proceso en grados Celsius
        duration = null, // Duración del proceso en horas
        clarifyingAgents = {}, // Agentes clarificantes utilizados (e.g., Bentonita, Gelatina)
        comment = null, // Comentarios adicionales
        completionStatus = 'NOT_COMPLETED', // Estado de finalización
        currentStage = 'CLARIFICATION', // Siempre 'CLARIFICATION' para esta clase
        completedAt = null, // Fecha de finalización
        dataHash = null // Hash para integridad de datos
    }) {
        this.id = id;
        this.batchId = batchId;
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.methodUsed = methodUsed; // clarificación usada
        this.initialTurbidity = initialTurbidity; // En NTU
        this.finalTurbidity = finalTurbidity; // En NTU
        this.volume = volume; // En litros
        this.temperature = temperature; // En °C
        this.duration = duration; // En horas
        this.clarifyingAgents = clarifyingAgents; // Agentes clarificantes utilizados
        this.comment = comment; // Comentarios adicionales
        this.completionStatus = completionStatus; // Estado de finalización
        this.currentStage = currentStage; // Siempre 'CLARIFICATION'
        this.completedAt = completedAt; // Fecha de finalización
        this.dataHash = dataHash; // Hash para integridad de datos
    }
}
