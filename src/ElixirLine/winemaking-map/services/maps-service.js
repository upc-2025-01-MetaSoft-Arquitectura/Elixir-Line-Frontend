// src/ElixirLine/winemaking-map/services/maps-service.js
import axios from "axios";

const http = axios.create({ baseURL: "http://localhost:3000" });

export class MapApiService {
    constructor() {
        this.resourceEndpoint = "/map";
    }

    // Obtener todos los polígonos guardados
    getAllFields() {
        return http.get(this.resourceEndpoint);
    }

    // Guardar un nuevo polígono (campo)
    createField(field) {
        return http.post(this.resourceEndpoint, field);
    }

    // Obtener un campo por ID
    getFieldById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    // Actualizar un campo
    updateField(id, field) {
        return http.put(`${this.resourceEndpoint}/${id}`, field);
    }

    // Eliminar un campo
    deleteField(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }
}