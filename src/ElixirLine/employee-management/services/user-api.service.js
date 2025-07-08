import http from "../../../shared/services/http-common.js";

export class UserApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }


    getUserById (userId) {
        return http.get(`${this.resourceEndpoint}/id/${userId}`);
    }

    update (userId, userData) {
        return http.put(`${this.resourceEndpoint}/${userId}`, userData);
    }

    delete (userId) {
        return http.delete(`${this.resourceEndpoint}/${userId}`);
    }

}