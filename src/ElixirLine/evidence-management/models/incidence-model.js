export class Incident {
    constructor({
                    id,
                    taskId,
                    description,
                    imageUrl,
                    createdAt,
                    updatedAt
                }) {
        this.id = id;
        this.taskId = taskId;
        this.description = description;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
