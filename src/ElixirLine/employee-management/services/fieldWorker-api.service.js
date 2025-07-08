import http from "../../../shared/services/http-common.js";

export class FieldWorkerApiService {
    constructor() {
        this.resourceEndpoint = "/fieldworkers";
    }

    getAllFieldWorkers() {
        return http.get(this.resourceEndpoint);
    }

    getFieldWorkerById(id) {
        return http.get(`/fie1dworkers/${id}`);
    }

    createFieldWorker(data) {
        return http.post(this.resourceEndpoint, data);
    }

    updateFieldWorker(id, data) {
        return http.put(`/fie1dworkers/${id}`, data);
    }

    deleteFieldWorker(id) {
        return http.delete(`/fie1dworkers/${id}`);
    }

    activateFieldWorker(id) {
        return http.patch(`/fie1dworkers/${id}/activate`);
    }

    deactivateFieldWorker(id) {
        return http.patch(`/fie1dworkers/${id}/deactivate`);
    }

    getFieldWorkerByUserId(userId) {
        return http.get(`${this.resourceEndpoint}/user/${userId}`);
    }
}