

export class FermentationStage {
    constructor({
                    stage = null,
                    registeredBy = null,
                    startDate = null,
                    endDate = null,
                    yeastUsedMgL = 0, // Cantidad de levadura usada en mg/L
                    pH = null, // pH del mosto
                    initialBrix = null, // Brix inicial del mosto
                    finalBrix = null, // Brix final del mosto
                    initialpH = null, // pH inicial del mosto
                    finalpH = null, // pH final del mosto
                    temperatureMax = null, // Temperatura máxima durante la fermentación
                    temperatureMin = null, // Temperatura mínima durante la fermentación
                    fermentationType = null, // Tipo de fermentación (ej. 'Alcohólica', 'Maloláctica')
                    tankCode = null, // Código del tanque utilizado
                    isFinalized = false, // Indica si la fermentación ha finalizado
                    comments = null, // Comentarios adicionales
                    isCompleted = false // Indica si la etapa está completa
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
