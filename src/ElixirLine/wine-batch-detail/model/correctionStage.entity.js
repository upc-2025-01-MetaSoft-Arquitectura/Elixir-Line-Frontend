export class CorrectionStage {
    constructor({
                    stage = null,
                    registeredBy = null,
                    startDate = null,
                    endDate = null,
                    initialBrix = null,
                    finalBrix = null,
                    addedSugarKg = null,
                    initialPH = null,
                    finalPH = null,
                    acidType = null,
                    acidAddedGL = null,
                    SO2AddedMgL = null,
                    nutrientsAdded = null,
                    justification = null,
                    comments = null,
                    isCompleted = false
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
