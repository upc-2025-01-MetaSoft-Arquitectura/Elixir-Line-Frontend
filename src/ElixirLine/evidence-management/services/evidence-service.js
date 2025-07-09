import http from "../../../shared/services/http-common.js";


export class EvidenceApiService {
    constructor() {
        this.resourceEndpoint = "/evidences";
    }

    // Crear evidencia para una tarea
    createEvidence(evidenceFormData) {
        // Forzar Content-Type a multipart/form-data para compatibilidad backend
        return http.post('/evidences', evidenceFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    // Actualizar parcialmente una evidencia (PATCH)
    updateEvidence(evidenceId, evidence) {
        return http.patch(`${this.resourceEndpoint}/${evidenceId}`, evidence);
    }

    // Eliminar evidencia
    deleteEvidence(evidenceId) {
        return http.delete(`${this.resourceEndpoint}/${evidenceId}`);
    }

    // Obtener evidencias por ID de tarea
    getEvidencesByTaskId(taskId) {
        return http.get(`${this.resourceEndpoint}/task/${taskId}`);
    }
}