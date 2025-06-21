export class TaskApiService {
    constructor() {
        this.baseUrl = 'http://localhost:3000/tasks' // Cambia el puerto si es necesario
    }

    async getTaskById(id) {
        const res = await fetch(`${this.baseUrl}/${id}`)
        if (!res.ok) throw new Error('Error al obtener la tarea')
        return await res.json()
    }

    async getAllTasks() {
        const res = await fetch(this.baseUrl)
        if (!res.ok) throw new Error('Error al obtener las tareas')
        return await res.json()
    }
}