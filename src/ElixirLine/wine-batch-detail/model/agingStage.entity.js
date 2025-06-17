export class AgingStage {
    constructor({
                    stage = null,
                    registeredBy = null,
                    startDate = null,
                    endDate = null,
                    containerType = null, // Ej. 'Barrica'
                    material = null,           // Ej. 'Roble Francés'
                    containerCode = null,
                    avgTemperature = null,
                    volumeLiters = null,
                    durationMonths = null,
                    frequencyDays = null, // Puede ser null
                    refilled = false,
                    batonnage = false,
                    rackings = 0,
                    purpose = null,
                    comments = null,
                    isCompleted = false
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
