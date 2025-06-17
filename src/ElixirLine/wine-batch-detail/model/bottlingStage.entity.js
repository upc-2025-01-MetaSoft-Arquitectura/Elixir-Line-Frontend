


export class BottlingStage {
    constructor({
                    stage = null,
                    registeredBy = null,
                    startDate = null,
                    endDate = null,
                    bottlingLine = null, // Línea de embotellado
                    bottlesFilled = 0,               // Total de botellas llenadas
                    bottleVolumeMl = 0,             // Volumen por botella
                    totalVolumeLiters = 0,       // Volumen total embotellado
                    sealType = null,                         // Tipo de sellado (ej. 'Corcho natural')
                    code = null,                                 // Código identificador del lote embotellado
                    temperature = null,                   // Temperatura durante embotellado
                    wasFiltered = false,
                    wereLabelsApplied = false,
                    wereCapsulesApplied = false,
                    comments = null,
                    isCompleted = false
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
