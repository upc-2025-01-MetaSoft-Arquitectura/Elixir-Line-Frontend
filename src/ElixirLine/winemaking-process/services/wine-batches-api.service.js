import axios from "axios";

const http = axios.create({ baseURL: "http://localhost:3000" });

export class WineBatchesApiService {
    constructor() {
        this.resourceEndpoint = "/wine-batches";
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

    findByInternalCode(internalCode) {
        return http.get(`${this.resourceEndpoint}?internalCode=${internalCode}`);
    }
}