

export class ClarificationStage {
    constructor({
                    stage = null,
                    registeredBy = null,
                    startDate = null,
                    endDate = null,
                    method = null, // Ej. 'Bentonita'
                    clarifyingAgents = [], // Array de { name, dose }
                    turbidityBeforeNTU = null,
                    turbidityAfterNTU = null,
                    volumeLiters = null,
                    temperature = null,
                    durationHours = null,
                    comments = null,
                    isCompleted = false
                }) {
        this.stage = stage; // Siempre 'Clarificación'
        this.registeredBy = registeredBy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.method = method; // Ej. 'Bentonita'
        this.clarifyingAgents = clarifyingAgents; // Array de { name, dose }
        this.turbidityBeforeNTU = turbidityBeforeNTU;
        this.turbidityAfterNTU = turbidityAfterNTU;
        this.volumeLiters = volumeLiters;
        this.temperature = temperature;
        this.durationHours = durationHours;
        this.comments = comments;
        this.isCompleted = isCompleted;
    }
}
