import http from "../../../shared/services/http-common.js";

export class batchAndCampaignApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;

    }

    getAllResources() {
        return http.get(this.resourceEndpoint);
    }


    // Mi endpoint final es este:
    // https://elixirline-service-28111382458.us-west1.run.app/api/v1/api/v1/batches/campaign/{campaignId}
    // El http contiene el endpoint base: https://elixirline-service-28111382458.us-west1.run.app/api/v1/api/v1/
    // El resourceEndpoint es: batches
    getResourcesByCampaignId(campaignId) {
        return http.get(`${this.resourceEndpoint}/campaign/${campaignId}`);
    }

    update(id, resource) {
        return http.put(`${this.resourceEndpoint}/${id}`, resource);
    }

    create(resource) {
        return http.post(this.resourceEndpoint, resource);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

}





/*

import axios from "axios";

const http = axios.create({baseURL: "http://localhost:3000"});

export class batchAndCampaignApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    getAllResources() {
        return http.get(this.resourceEndpoint);
    }

    getResourceById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    getResourcesByCampaignId(campaignId) {
        return http.get(`${this.resourceEndpoint}`, {
            params: { campaignId }
        });
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
*/