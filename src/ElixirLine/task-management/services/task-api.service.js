// src/ElixirLine/task-management/services/taskApiService.js
import axios from "axios";

const http = axios.create({ baseURL: "http://localhost:3000" });

export class TaskApiService {
    constructor() {
        this.resourceEndpoint = "/tasks";
    }

    getAllTasks() {
        return http.get(this.resourceEndpoint);
    }

    getTaskById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    createTask(task) {
        return http.post(this.resourceEndpoint, task);
    }

    updateTask(id, task) {
        return http.put(`${this.resourceEndpoint}/${id}`, task);
    }

    deleteTask(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    updateProgress(id, progress) {
        return http.patch(`${this.resourceEndpoint}/${id}`, { progress });
    }
}
export class SupplyApiService {
    constructor() {
        this.resourceEndpoint = "/supplies";
    }

    getAllSupplies() {
        return http.get(this.resourceEndpoint);
    }
}
export class EmployeeApiService {
    constructor() {
        this.resourceEndpoint = "/employees";
    }

    getAllEmployees() {
        return http.get(this.resourceEndpoint);
    }
}