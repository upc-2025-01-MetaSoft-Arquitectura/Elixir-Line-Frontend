

export class WineBatch {
    /**
     * @param {int} id
     * @param {string} internalCode
     * @param {Date} receptionDate
     * @param {string} harvestCampaign
     * @param {string} vineyardOrigin
     * @param {string} grapeVariety
     * @param {number} initialGrapeQuantityKg
     * @param {string} createdBy
     * @param {string} status
     * @param {string} currentStage
     */
    constructor(
        {
            id,
            internalCode,
            receptionDate,
            harvestCampaign,
            vineyardOrigin,
            grapeVariety,
            initialGrapeQuantityKg,
            createdBy,
            status,
            currentStage
        }
    ) {
        this.id = id;
        this.internalCode = internalCode;
        this.receptionDate = receptionDate;
        this.harvestCampaign = harvestCampaign;
        this.vineyardOrigin = vineyardOrigin;
        this.grapeVariety = grapeVariety;
        this.initialGrapeQuantityKg = initialGrapeQuantityKg;
        this.createdBy = createdBy;
        this.status = status;
        this.currentStage = currentStage;
    }



}