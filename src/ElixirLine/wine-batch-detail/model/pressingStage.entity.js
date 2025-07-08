

export class PressingStage {

    constructor(
        {
            id = null,
            batchId = null,
            employee = null,
            startDate = null,
            endDate = null,
            pressType = null, // Tipo de prensa (e.g., Hidráulica, Neumática)
            pressure = null, // Presión utilizada en bares
            duration = null, // Duración del prensado en minutos
            pomadeWeight = 0, // Peso de la pomada en kg
            mustYield = 0, // Rendimiento en litros
            mustUsage = null, // Uso del mosto (e.g., Fermentación, Clarificación)
            comment = null, // Comentarios adicionales
            completionStatus = 'NOT_COMPLETED', // Estado de finalización
            currentStage = 'PRESSING', // Siempre 'PRESSING' para esta clase
            completedAt = null, // Fecha de finalización
            dataHash = null // Hash para integridad de datos
        }
    ) {
        this.id = id;
        this.batchId = batchId;
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.pressType = pressType;
        this.pressure = pressure;
        this.duration = duration;
        this.pomadeWeight = pomadeWeight;
        this.mustYield = mustYield;
        this.mustUsage = mustUsage;
        this.comment = comment;
        this.completionStatus = completionStatus;
        this.currentStage = currentStage; // Siempre 'PRESSING'
        this.completedAt = completedAt;
        this.dataHash = dataHash; // Para integridad de datos
    }
}


