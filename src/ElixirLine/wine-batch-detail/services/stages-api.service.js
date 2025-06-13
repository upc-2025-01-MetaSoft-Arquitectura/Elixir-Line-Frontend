import axios from "axios";

const http = axios.create({baseURL: "http://localhost:3000"});

export class StagesApiService {
    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    findStagesByBatchId(batchId) {
        return http.get(`${this.resourceEndpoint}?batchId=${batchId}`);
    }

    create(resource) {
        return http.post(this.resourceEndpoint, resource);
    }

    update(id, resource) {
        return http.put(`${this.resourceEndpoint}/${id}`, resource);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    findResourceById(id) {
        return http.get(`${this.resourceEndpoint}?id=${id}`);
    }
}