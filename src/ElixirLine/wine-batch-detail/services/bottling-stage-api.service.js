import http from "../../../shared/services/http-common.js";

export class BottlingStageApiService {
    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retorna la etapa de corrección de un lote específico
    getBottlingStageByBatchId(batchId) {
        return http.get(`${this.resourceEndpoint}/${batchId}/bottling-stage`);
    }

    // Crear una etapa de corrección para un lote específico
    create(batchId, bottlingStageData) {
        return http.post(`${this.resourceEndpoint}/${batchId}/bottling-stage`, bottlingStageData);
    }

    // Actualizar una etapa de corrección para un lote específico
    patch(batchId, bottlingStageData) {
        return http.patch(`${this.resourceEndpoint}/${batchId}/bottling-stage`, bottlingStageData);
    }

}