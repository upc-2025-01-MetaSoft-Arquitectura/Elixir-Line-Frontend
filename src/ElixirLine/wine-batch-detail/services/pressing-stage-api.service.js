import http from "../../../shared/services/http-common.js";

export class PressingStageApiService {
    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }


    // Retorna la etapa de corrección de un lote específico
    getPressingStageByBatchId(batchId) {
        return http.get(`${this.resourceEndpoint}/${batchId}/pressing-stage`);
    }

    // Crear una etapa de corrección para un lote específico
    create(batchId, pressingStageData) {
        return http.post(`${this.resourceEndpoint}/${batchId}/pressing-stage`, pressingStageData);
    }

    // Actualizar una etapa de corrección para un lote específico
    patch(batchId, pressingStageData) {
        return http.patch(`${this.resourceEndpoint}/${batchId}/pressing-stage`, pressingStageData);
    }


}