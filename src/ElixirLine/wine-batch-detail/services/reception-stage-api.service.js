import http from "../../../shared/services/http-common.js";


export class ReceptionStageApiService {
    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retorna la etapa de recepción de un lote específico
    getReceptionStageByBatchId(batchId) {
        return http.get(`${this.resourceEndpoint}/${batchId}/reception-stage`);
    }

    // Crear una etapa de recepción para un lote específico
    create(batchId, receptionStageData) {
        return http.post(`${this.resourceEndpoint}/${batchId}/reception-stage`, receptionStageData);
    }

    // Actualizar una etapa de recepción para un lote específico
    patch(batchId, receptionStageData) {
        return http.patch(`${this.resourceEndpoint}/${batchId}/reception-stage`, receptionStageData);
    }

}