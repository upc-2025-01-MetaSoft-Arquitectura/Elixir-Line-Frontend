export class AgingStage {
    constructor({
                    stage,
                    registeredBy,
                    startDate,
                    endDate,
                    containerType,
                    material,
                    containerCode,
                    avgTemperature,
                    volumeLiters,
                    durationMonths,
                    frequencyDays,
                    refilled,
                    batonnage,
                    rackings,
                    purpose,
                    comments,
                    isCompleted
                }) {
        this.stage = stage; // Siempre 'Añejamiento'
        this.registeredBy = registeredBy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.containerType = containerType; // Ej. 'Barrica'
        this.material = material;           // Ej. 'Roble Francés'
        this.containerCode = containerCode;
        this.avgTemperature = avgTemperature;
        this.volumeLiters = volumeLiters;
        this.durationMonths = durationMonths;
        this.frequencyDays = frequencyDays; // Puede ser null
        this.refilled = refilled;
        this.batonnage = batonnage;
        this.rackings = rackings;
        this.purpose = purpose;
        this.comments = comments;
        this.isCompleted = isCompleted;
    }
}
