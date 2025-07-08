import http from "../../../shared/services/http-common.js";

export class CorrectionStageApiService {
    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retorna la etapa de correction de un lote específico
    getCorrectionStageByBatchId(batchId) {
        return http.get(`${this.resourceEndpoint}/${batchId}/correction-stage`);
    }

    // Crear una etapa de corrección para un lote específico
    create(batchId, correctionStageData) {
        return http.post(`${this.resourceEndpoint}/${batchId}/correction-stage`, correctionStageData);
    }

    // Actualizar una etapa de corrección para un lote específico
    patch(batchId, correctionStageData) {
        return http.patch(`${this.resourceEndpoint}/${batchId}/correction-stage`, correctionStageData);
    }
}
