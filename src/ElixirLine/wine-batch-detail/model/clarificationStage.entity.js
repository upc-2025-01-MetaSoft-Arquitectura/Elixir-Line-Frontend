

export class ClarificationStage {
    constructor({
                    stage,
                    registeredBy,
                    startDate,
                    endDate,
                    method,
                    clarifyingAgents,
                    turbidityBeforeNTU,
                    turbidityAfterNTU,
                    volumeLiters,
                    temperature,
                    durationHours,
                    comments,
                    isCompleted
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
