import http from "../../../shared/services/http-common.js";


export class EmployeeApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    getAllResources() {
        return http.get(this.resourceEndpoint);
    }

    getResourceById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(resource) {
        return http.post(this.resourceEndpoint, resource);
    }

    update(id, formData) {
        return http.put(`${this.resourceEndpoint}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    findResourceById(id) {
        return http.get(`${this.resourceEndpoint}?id=${id}`);
    }
    getStatusByInternalCode(internalCode) {
        return http.get(`/wine-batches?internalCode=${internalCode}`);
    }
    createTask(task) {
        return http.post("/tasks", task);
    }


}