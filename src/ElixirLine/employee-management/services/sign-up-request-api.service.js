import http from "../../../shared/services/http-common.js";


export class SignUpRequestApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    create(signUpRequest) {
        return http.post(this.resourceEndpoint, signUpRequest);
    }

}