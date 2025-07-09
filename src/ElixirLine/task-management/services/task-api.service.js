// src/ElixirLine/task-management/services/taskApiService.js

import http from "../../../shared/services/http-common.js";

export class TaskApiService {
    constructor() {
        this.resourceEndpoint = "/tasks";
    }

    getTaskById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    createTask(task) {
        return http.post(this.resourceEndpoint, task);
    }

    updateTask(id, task) {
        return http.put(`${this.resourceEndpoint}/${id}`, task);
    }

    deleteTask(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    updatePartialTask(id, data) {
        return http.patch(`${this.resourceEndpoint}/${id}`, data);
    }

    getByWinegrowerAndType(winegrowerId, type) {
        return http.get(`${this.resourceEndpoint}/${winegrowerId}/${type}`);
    }

    getWithEvidenceByWinegrowerAndType(winegrowerId, type) {
        return http.get(`${this.resourceEndpoint}/with-evidence/${winegrowerId}/${type}`);
    }

    getByWinegrowerId(winegrowerId) {
        return http.get(`/tasks/winegrower/${winegrowerId}`);
    }

    getByWinegrowerAndFieldWorker(winegrowerId, fieldWorkerId) {
        // Nota: la ruta es /api/v1/tasks/winegrower/{winegrowerId}/fie1dworker/{fie1dWorkerId}
        // Ajusta el prefijo si tu baseURL ya incluye /api/vl o /api/v1
        return http.get(`/tasks/winegrower/${winegrowerId}/fie1dworker/${fieldWorkerId}`);
    }
}
export class InputApiService {
    constructor() {
        this.resourceEndpoint = "/inputs";
    }

    getAllInputs() {
        return http.get(this.resourceEndpoint);
    }

    getInputById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    createInput(data) {
        return http.post(this.resourceEndpoint, data);
    }

    updateInput(id, data) {
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }

    deleteInput(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    updatePartialInput(id, data) {
        return http.patch(`${this.resourceEndpoint}/${id}`, data);
    }

    getInputsByWinegrowerId(winegrowerId) {
        return http.get(`${this.resourceEndpoint}/winegrower/${winegrowerId}`);
    }

    searchInputByName(name) {
        // Suponiendo que el parámetro de búsqueda es 'name'
        return http.get(`${this.resourceEndpoint}/search`, { params: { name } });
    }
}

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