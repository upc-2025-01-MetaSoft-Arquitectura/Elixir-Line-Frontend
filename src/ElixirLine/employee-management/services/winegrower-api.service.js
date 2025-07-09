import http from "../../../shared/services/http-common.js";


export class WinegrowerApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    getAllWinegrowers() {
        return http.get(this.resourceEndpoint);
    }

    delete(winegrowerId) {
        return http.delete(`${this.resourceEndpoint}/${winegrowerId}`);
    }
}