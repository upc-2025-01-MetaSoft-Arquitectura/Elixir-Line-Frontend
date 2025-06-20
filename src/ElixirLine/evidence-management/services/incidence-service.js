// src/ElixirLine/evidence-management/services/incidence-service.js
import axios from "axios";

const http = axios.create({ baseURL: "http://localhost:3000" });

export class IncidenceApiService {
    constructor() {
        this.resourceEndpoint = "/incidences";
    }

    getAllIncidences() {
        return http.get(this.resourceEndpoint);
    }

    getIncidenceById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    createIncidence(incidence) {
        return http.post(this.resourceEndpoint, incidence);
    }

    updateIncidence(id, incidence) {
        return http.put(`${this.resourceEndpoint}/${id}`, incidence);
    }

    deleteIncidence(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }
}