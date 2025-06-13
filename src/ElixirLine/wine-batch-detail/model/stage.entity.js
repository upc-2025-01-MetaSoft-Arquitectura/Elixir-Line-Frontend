

export class Stage {

    constructor({
        id = null, // ID único de la etapa
        batchId = null, // ID del lote al que pertenece esta etapa
        receptionStage = {}, // Etapa de Recepción
        correctionStage = {}, // Etapa de Corrección
        fermentationStage = {}, // Etapa de Fermentación
        pressingStage = {}, // Etapa de Prensado
        clarificationStage = {}, // Etapa de Clarificación
        agingStage = {}, // Etapa de Crianza
        filtrationStage = {}, // Etapa de Filtración
        bottlingStage = {} // Etapa de Embotellado,
    }) {
        this.id = id;
        this.batchId = batchId;
        this.receptionStage = receptionStage; // Etapa de Recepción
        this.correctionStage = correctionStage; // Etapa de Corrección
        this.fermentationStage = fermentationStage; // Etapa de Fermentación
        this.pressingStage = pressingStage; // Etapa de Prensado
        this.clarificationStage = clarificationStage; // Etapa de Clarificación
        this.agingStage = agingStage; // Etapa de Crianza
        this.filtrationStage = filtrationStage; // Etapa de Filtración
        this.bottlingStage = bottlingStage; // Etapa de Embotellado

    }
}