

export class FiltrationStage {
    constructor({
                    stage = null, // Siempre 'Filtración'
                    registeredBy = null,
                    startDate = null,
                    endDate = null,
                    filtrationType = null, // Ej. 'Filtración estéril'
                    filterMedia = null, // Ej. 'Membrana PES'
                    poreMicrons = 0, // Tamaño de poro en micrones
                    turbidityBefore = null, // NTU antes de la filtración
                    turbidityAfter = null, // NTU después de la filtración
                    temperature = null, // Temperatura durante la filtración
                    pressureBars = null, // Presión en bares durante la filtración
                    filteredVolumeLiters = 0, // Volumen filtrado en litros
                    isSterile = false, // Indica si la filtración es estéril
                    filterChanged = false, // Indica si se cambió el filtro
                    changeReason = null, // Motivo del cambio de filtro
                    comments = null, // Comentarios adicionales
                    isCompleted = false // Indica si la etapa está completa
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
