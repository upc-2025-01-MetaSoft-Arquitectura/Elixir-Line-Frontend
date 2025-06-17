
export class ReceptionStage {
    constructor({
                    stage = null,
                    registeredBy = null,
                    startDate = null,
                    endDate = null,
                    sugarLevelBrix = null,
                    pH = null,
                    temperature = null,
                    quantityKg = null,
                    comments = null,
                    isCompleted = false
                }) {
        this.stage = stage;
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