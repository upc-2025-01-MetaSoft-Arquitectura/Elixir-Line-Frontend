import http from "../../../shared/services/http-common.js";

export class UserSignUpApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }


    create(resource) {
        return http.post(this.resourceEndpoint, resource);
    }
}