import http from "../../../shared/services/http-common.js";


export class IncidenceApiService {
    constructor() {
        this.resourceEndpoint = "/incidents";
    }

    // Crear incidencia para una tarea
    createIncidence(incidence) {
        return http.post(this.resourceEndpoint, incidence);
    }

    // Obtener una incidencia por su ID
    getIncidenceById(incidenceId) {
        return http.get(`${this.resourceEndpoint}/${incidenceId}`);
    }

    // Eliminar una incidencia por ID
    deleteIncidence(incidenceId) {
        return http.delete(`${this.resourceEndpoint}/${incidenceId}`);
    }

    // Actualizar parcialmente una incidencia (PATCH)
    updateIncidence(incidenceId, incidence) {
        return http.patch(`${this.resourceEndpoint}/${incidenceId}`, incidence);
    }

    // Listar incidencias de tipo industrial
    getIndustrialIncidences() {
        return http.get(`${this.resourceEndpoint}/with-task-info/industrial`);
    }

    // Listar incidencias de tipo campo
    getFieldIncidences() {
        return http.get(`${this.resourceEndpoint}/with-task-info/field`);
    }

    // Obtener todas las incidencias
    getAllIncidences() {
        return http.get(this.resourceEndpoint);
    }
}