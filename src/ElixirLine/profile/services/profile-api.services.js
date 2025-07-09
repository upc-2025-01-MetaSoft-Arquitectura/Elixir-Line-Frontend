import http from "../../../shared/services/http-common.js";


export class ProfileApiServices {


    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    getResourceById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(resource) {
        return http.post(this.resourceEndpoint, resource, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
        );
    }

    update(id, resourceData) {
        return http.put(`${this.resourceEndpoint}/${id}`, resourceData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        },
    );
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    findResourceById(id) {
        return http.get(`${this.resourceEndpoint}?id=${id}`);
    }
}