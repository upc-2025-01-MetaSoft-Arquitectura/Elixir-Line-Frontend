


export class BottlingStage {
    constructor({
                    stage,
                    registeredBy,
                    startDate,
                    endDate,
                    bottlingLine,
                    bottlesFilled,
                    bottleVolumeMl,
                    totalVolumeLiters,
                    sealType,
                    code,
                    temperature,
                    wasFiltered,
                    wereLabelsApplied,
                    wereCapsulesApplied,
                    comments,
                    isCompleted
                }) {
        this.stage = stage; // Siempre 'Embotellado'
        this.registeredBy = registeredBy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.bottlingLine = bottlingLine;                 // Línea de embotellado
        this.bottlesFilled = bottlesFilled;               // Total de botellas llenadas
        this.bottleVolumeMl = bottleVolumeMl;             // Volumen por botella en ml
        this.totalVolumeLiters = totalVolumeLiters;       // Volumen total embotellado
        this.sealType = sealType;                         // Tipo de sellado (ej. 'Corcho natural')
        this.code = code;                                 // Código identificador del lote embotellado
        this.temperature = temperature;                   // Temperatura durante embotellado
        this.wasFiltered = wasFiltered;
        this.wereLabelsApplied = wereLabelsApplied;
        this.wereCapsulesApplied = wereCapsulesApplied;
        this.comments = comments;
        this.isCompleted = isCompleted;
    }
}
