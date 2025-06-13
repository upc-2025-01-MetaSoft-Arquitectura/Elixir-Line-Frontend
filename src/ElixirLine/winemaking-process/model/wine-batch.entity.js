

export class WineBatch {


    constructor({
                    id,
                    internalCode,
                    campaignId,
                    receptionDate,
                    harvestCampaign,
                    vineyardOrigin,
                    grapeVariety,
                    initialGrapeQuantityKg,
                    createdBy,
                    progress,
                    currentStage,
                    status}) {
        this.id = id;
        this.internalCode = internalCode;
        this.campaignId = campaignId;
        this.receptionDate = receptionDate;
        this.harvestCampaign = harvestCampaign;
        this.vineyardOrigin = vineyardOrigin;
        this.grapeVariety = grapeVariety;
        this.initialGrapeQuantityKg = initialGrapeQuantityKg;
        this.createdBy = createdBy;
        this.progress = progress;
        this.currentStage = currentStage;
        this.status = status;
    }

}