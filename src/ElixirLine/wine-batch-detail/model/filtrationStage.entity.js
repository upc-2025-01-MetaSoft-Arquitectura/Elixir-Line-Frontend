

export class FiltrationStage {
    constructor({
                    stage,
                    registeredBy,
                    startDate,
                    endDate,
                    filtrationType,
                    filterMedia,
                    poreMicrons,
                    turbidityBefore,
                    turbidityAfter,
                    temperature,
                    pressureBars,
                    filteredVolumeLiters,
                    isSterile,
                    filterChanged,
                    changeReason,
                    comments,
                    isCompleted
                }) {
        this.stage = stage; // Siempre 'Filtración'
        this.registeredBy = registeredBy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.filtrationType = filtrationType;     // Ej. 'Filtración estéril'
        this.filterMedia = filterMedia;           // Ej. 'Membrana PES'
        this.poreMicrons = poreMicrons;
        this.turbidityBefore = turbidityBefore;
        this.turbidityAfter = turbidityAfter;
        this.temperature = temperature;
        this.pressureBars = pressureBars;
        this.filteredVolumeLiters = filteredVolumeLiters;
        this.isSterile = isSterile;
        this.filterChanged = filterChanged;
        this.changeReason = changeReason;
        this.comments = comments;
        this.isCompleted = isCompleted;
    }
}
