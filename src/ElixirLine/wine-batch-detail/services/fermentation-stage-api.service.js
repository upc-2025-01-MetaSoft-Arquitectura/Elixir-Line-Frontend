import http from "../../../shared/services/http-common.js";

export class FermentationStageApiService {
    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retorna la etapa de fermentation de un lote específico
    getFermentationStageByBatchId(batchId) {
        return http.get(`${this.resourceEndpoint}/${batchId}/fermentation-stage`);
    }

    // Crea una nueva etapa de fermentación para un lote específico
    create(batchId, fermentationStage) {
        return http.post(`${this.resourceEndpoint}/${batchId}/fermentation-stage`, fermentationStage);
    }

    // Actualiza una etapa de fermentación existente para un lote específico
    patch(batchId, fermentationStage) {
        return http.patch(`${this.resourceEndpoint}/${batchId}/fermentation-stage`, fermentationStage);
    }

}