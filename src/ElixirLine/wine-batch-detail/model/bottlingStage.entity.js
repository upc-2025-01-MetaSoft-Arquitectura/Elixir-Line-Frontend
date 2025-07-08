
export class BottlingStage {
    constructor({
                    id = null,
                    batchId = null,
                    employee = null,
                    startDate = null,
                    endDate = null,
                    bottlingLine = null,
                    filledBottles = 0,
                    bottleVolume = 750, // Default to 750ml
                    totalVolume = 0, // Calculated as filledBottles * bottleVolume
                    sealingType = null,
                    vineyardCode = null,
                    temperature = null,
                    filteredBeforeBottling = false,
                    labelsAtThisStage = false,
                    capsuleOrSealApplication = false,
                    comment = null,
                    completionStatus = 'NOT_COMPLETED', // Default status
                    currentStage = 'BOTTLING', // Always 'BOTTLING' for this class
                    completedAt = null,
                    dataHash = null
                }) {
        this.id = id;
        this.batchId = batchId;
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.bottlingLine = bottlingLine;
        this.filledBottles = filledBottles;
        this.bottleVolume = bottleVolume;
        this.totalVolume = totalVolume || (filledBottles * bottleVolume / 1000); // Convert to liters
        this.sealingType = sealingType;
        this.vineyardCode = vineyardCode;
        this.temperature = temperature;
        this.filteredBeforeBottling = filteredBeforeBottling;
        this.labelsAtThisStage = labelsAtThisStage;
        this.capsuleOrSealApplication = capsuleOrSealApplication;
        this.comment = comment;
        this.completionStatus = completionStatus;
        this.currentStage = currentStage; // Always 'BOTTLING'
        this.completedAt = completedAt;
        this.dataHash = dataHash; // For integrity checks
    }
}
