
export class PressingStage {
    constructor({
                    stage = null, // Siempre 'Prensado'
                    registeredBy = null,
                    startDate = null,
                    endDate = null,
                    pressType = null, // Ej. 'Neumática', 'Horizontal', etc.
                    pressPressureBars = 0, // Presión en bares
                    durationMinutes = 0, // Duración en minutos
                    pomaceKg = 0, // Peso de la orujo en kg
                    yieldLiters = 0, // Rendimiento en litros
                    mustUsage = null, // Ej. 'Vino blanco joven'
                    comments = null, // Comentarios adicionales
                    isCompleted = false // Indica si la etapa está completa
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
