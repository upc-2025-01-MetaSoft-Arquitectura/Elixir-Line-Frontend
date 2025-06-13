
export class ReceptionStage {
    constructor({
                    stage,
                    registeredBy,
                    startDate,
                    endDate,
                    sugarLevelBrix,
                    pH,
                    temperature,
                    quantityKg,
                    comments,
                    isCompleted
                }) {
        this.stage = stage; // Siempre 'Recepción' para esta clase
        this.registeredBy = registeredBy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sugarLevelBrix = sugarLevelBrix;
        this.pH = pH;
        this.temperature = temperature;
        this.quantityKg = quantityKg;
        this.comments = comments;
        this.isCompleted = isCompleted;
    }
}