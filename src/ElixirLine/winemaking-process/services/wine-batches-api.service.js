// src/ElixirLine/winemaking-process/services/wine-batches-api.service.js
import http from "../../../shared/services/http-common.js";

export class WineBatchesApiService {
    constructor() {
        this.resourceEndpoint = "/batches";
    }

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(data) {
        return http.post(this.resourceEndpoint, data);
    }

    update(id, data) {
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    updateProgressStatusOrLot(id, data) {
        // data puede tener progress, status o currentLot
        return http.patch(`${this.resourceEndpoint}/${id}`, data);
    }

    getStagesByBatchId(batchId) {
        return http.get(`${this.resourceEndpoint}/${batchId}/stages`);
    }

    getByWinegrowerId(winegrowerId) {
        return http.get(`${this.resourceEndpoint}/winegrower/${winegrowerId}`);
    }

    getByCampaignId(campaignId) {
        return http.get(`${this.resourceEndpoint}/campaign/${campaignId}`);
    }
}