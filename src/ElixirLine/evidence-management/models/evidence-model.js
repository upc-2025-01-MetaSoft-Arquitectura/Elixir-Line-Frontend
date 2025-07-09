export class Evidence {
    constructor({
                    id,
                    taskId,
                    progressPercentage,
                    description,
                    imageUrl,
                    createdAt,
                    updatedAt
                }) {
        this.id = id;
        this.taskId = taskId;
        this.progressPercentage = progressPercentage;
        this.description = description;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
