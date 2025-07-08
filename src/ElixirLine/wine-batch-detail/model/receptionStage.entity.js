


export class ReceptionStage {

    constructor(
        {
            id = '',
            batchId = '',
            employee = '',
            startDate = '',
            endDate = '',
            sugarLevel = 0,
            pHLevel = 0,
            temperature = 0,
            quantityKg = 0,
            comment = '',
            completionStatus = '',
            currentStage = '',
            completedAt = false,
            dataHash = null
        }
    ) {
        this.id = id;
        this.batchId = batchId;
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sugarLevel = sugarLevel;
        this.pHLevel = pHLevel;
        this.temperature = temperature;
        this.quantityKg = quantityKg;
        this.comment = comment;
        this.completionStatus = completionStatus;
        this.currentStage = currentStage;
        this.completedAt = completedAt;
        this.dataHash = dataHash;
    }

}