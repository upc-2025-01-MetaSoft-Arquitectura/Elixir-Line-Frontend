import http from "../../../shared/services/http-common.js";

export class FiltrationStageApiService {
    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }


    // Retorna la etapa de corrección de un lote específico
    getFiltrationStageByBatchId(batchId) {
        return http.get(`${this.resourceEndpoint}/${batchId}/filtration-stage`);
    }

    // Crear una etapa de corrección para un lote específico
    create(batchId, filtrationStageData) {
        return http.post(`${this.resourceEndpoint}/${batchId}/filtration-stage`, filtrationStageData);
    }

    // Actualizar una etapa de corrección para un lote específico
    patch(batchId, filtrationStageData) {
        return http.patch(`${this.resourceEndpoint}/${batchId}/filtration-stage`, filtrationStageData);
    }


}