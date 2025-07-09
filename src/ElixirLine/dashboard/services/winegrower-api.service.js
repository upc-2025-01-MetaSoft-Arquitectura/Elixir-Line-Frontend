// services/winegrower-api.service.js
import http from "../../../shared/services/http-common";

export class WinegrowerApiService {
    async getByUserId(userId, token) {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        return http.get(`/winegrowers/${userId}`, config);
    }
}