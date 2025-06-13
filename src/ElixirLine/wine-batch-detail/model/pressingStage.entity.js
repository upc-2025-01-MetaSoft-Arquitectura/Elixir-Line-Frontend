
export class PressingStage {
    constructor({
                    stage,
                    registeredBy,
                    startDate,
                    endDate,
                    pressType,
                    pressPressureBars,
                    durationMinutes,
                    pomaceKg,
                    yieldLiters,
                    mustUsage,
                    comments,
                    isCompleted
                }) {
        this.stage = stage; // Siempre 'Prensado'
        this.registeredBy = registeredBy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.pressType = pressType;               // Ej. 'Neumática', 'Horizontal', etc.
        this.pressPressureBars = pressPressureBars;
        this.durationMinutes = durationMinutes;
        this.pomaceKg = pomaceKg;
        this.yieldLiters = yieldLiters;
        this.mustUsage = mustUsage;               // Ej. 'Vino blanco joven'
        this.comments = comments;
        this.isCompleted = isCompleted;
    }
}
