import http from "../../../shared/services/http-common.js";


export class SupplyApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    getAllResources(winegrowerId) {
        return http.get(`${this.resourceEndpoint}/winegrower/${winegrowerId}`);
    }

    create(data){
        return http.post(`${this.resourceEndpoint}`, data);
    }


    update(resourceId, data) {
        return http.put(`${this.resourceEndpoint}/${resourceId}`, data);
    }

    delete(resourceId) {
        return http.delete(`${this.resourceEndpoint}/${resourceId}`);
    }

}
