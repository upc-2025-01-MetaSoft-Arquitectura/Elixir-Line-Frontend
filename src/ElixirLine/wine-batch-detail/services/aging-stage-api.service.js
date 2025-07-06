import http from "../../../shared/services/http-common.js";

export class CorrectionStageApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retorna la etapa de corrección de un lote específico
    getCorrectionStageByBatchId(batchId) {
        return http.get(`${this.resourceEndpoint}/${batchId}/aging-stage`);
    }

    // Crear una etapa de corrección para un lote específico
    create(batchId, agingStageData) {
        return http.post(`${this.resourceEndpoint}/${batchId}/aging-stage`, agingStageData);
    }

    // Actualizar una etapa de corrección para un lote específico
    patch(batchId, agingStageData) {
        return http.patch(`${this.resourceEndpoint}/${batchId}/aging-stage`, agingStageData);
    }

}