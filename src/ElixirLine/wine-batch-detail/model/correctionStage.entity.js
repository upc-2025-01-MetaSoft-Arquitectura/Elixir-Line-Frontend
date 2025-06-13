export class CorrectionStage {
    constructor({
                    stage,
                    registeredBy,
                    startDate,
                    endDate,
                    initialBrix,
                    finalBrix,
                    addedSugarKg,
                    initialPH,
                    finalPH,
                    acidType,
                    acidAddedGL,
                    SO2AddedMgL,
                    nutrientsAdded,
                    justification,
                    comments,
                    isCompleted
                }) {
        this.stage = stage; // Siempre 'Corrección' para esta clase
        this.registeredBy = registeredBy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.initialBrix = initialBrix;
        this.finalBrix = finalBrix;
        this.addedSugarKg = addedSugarKg;
        this.initialPH = initialPH;
        this.finalPH = finalPH;
        this.acidType = acidType;
        this.acidAddedGL = acidAddedGL;
        this.SO2AddedMgL = SO2AddedMgL;
        this.nutrientsAdded = nutrientsAdded; // Array de objetos con name y quantityMgL
        this.justification = justification;
        this.comments = comments;
        this.isCompleted = isCompleted;
    }
}
