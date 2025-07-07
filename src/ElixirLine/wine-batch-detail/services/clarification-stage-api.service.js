import http from "../../../shared/services/http-common.js";

export class ClarificationStageApiService {
    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retorna la etapa de corrección de un lote específico
    getClarificationStageByBatchId(batchId) {
        return http.get(`${this.resourceEndpoint}/${batchId}/clarification-stage`);
    }

    // Crear una etapa de corrección para un lote específico
    create(batchId, clarificationStageData) {
        return http.post(`${this.resourceEndpoint}/${batchId}/clarification-stage`, clarificationStageData);
    }

    // Actualizar una etapa de corrección para un lote específico
    patch(batchId, clarificationStageData) {
        return http.patch(`${this.resourceEndpoint}/${batchId}/clarification-stage`, clarificationStageData);
    }

}