
export class AgingStage {
    constructor({
        id = null,
        batchId = null,
        employee = null,
        startDate = null,
        endDate = null,
        containerType = null, // Tipo de contenedor (e.g., Barrica, Tanque)
        material = null, // Material del contenedor (e.g., Madera, Acero Inoxidable)
        containerCode = null, // Código del contenedor
        averageTemperature = null, // Temperatura promedio en grados Celsius
        volume = 0, // Volumen del contenedor en litros
        duration = 0, // Duración del añejamiento en meses
        frequency = 0, // Frecuencia de batonnage en días
        batonnage = 0, // Número de batonnages realizados
        refills = 0, // Número de recargas realizadas
        rackings = 0, // Número de trasiegos realizados
        purpose = null, // Propósito del añejamiento (e.g., Mejorar sabor)
        comment = null, // Comentarios adicionales
        completionStatus = 'NOT_COMPLETED', // Estado de finalización
        currentStage = 'AGING', // Siempre 'AGING' para esta clase
        completedAt = null, // Fecha de finalización
        dataHash = null // Hash para integridad de datos
    }) {
        this.id = id;
        this.batchId = batchId;
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.containerType = containerType;
        this.material = material;
        this.containerCode = containerCode;
        this.averageTemperature = averageTemperature;
        this.volume = volume; // En litros
        this.duration = duration; // En meses
        this.frequency = frequency; // En días
        this.batonnage = batonnage; // Número de batonnages realizados
        this.refills = refills; // Número de recargas realizadas
        this.rackings = rackings; // Número de trasiegos realizados
        this.purpose = purpose;
        this.comment = comment;
        this.completionStatus = completionStatus;
        this.currentStage = currentStage; // Siempre 'AGING'
        this.completedAt = completedAt;
        this.dataHash = dataHash; // Para integridad de datos
    }
}
