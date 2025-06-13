

export class FermentationStage {
    constructor({
                    stage,
                    registeredBy,
                    startDate,
                    endDate,
                    yeastUsedMgL,
                    pH,
                    initialBrix,
                    finalBrix,
                    initialpH,
                    finalpH,
                    temperatureMax,
                    temperatureMin,
                    fermentationType,
                    tankCode,
                    isFinalized,
                    comments,
                    isCompleted
                }) {
        this.stage = stage; // Siempre 'Fermentación'
        this.registeredBy = registeredBy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.yeastUsedMgL = yeastUsedMgL;
        this.pH = pH;
        this.initialBrix = initialBrix;
        this.finalBrix = finalBrix;
        this.initialpH = initialpH;
        this.finalpH = finalpH;
        this.temperatureMax = temperatureMax;
        this.temperatureMin = temperatureMin;
        this.fermentationType = fermentationType;
        this.tankCode = tankCode;
        this.isFinalized = isFinalized;
        this.comments = comments;
        this.isCompleted = isCompleted;
    }
}
