// src/ElixirLine/evidence-management/services/evidence-service.js
import axios from "axios";

const http = axios.create({ baseURL: "http://localhost:3000" });

export class EvidenceApiService {
    constructor() {
        this.resourceEndpoint = "/evidences";
    }

    getAllEvidences() {
        return http.get(this.resourceEndpoint);
    }

    getEvidenceById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    createEvidence(evidence) {
        return http.post(this.resourceEndpoint, evidence);
    }

    updateEvidence(id, evidence) {
        return http.put(`${this.resourceEndpoint}/${id}`, evidence);
    }

    deleteEvidence(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }
}