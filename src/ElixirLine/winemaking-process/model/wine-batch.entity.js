
/*
 {
    "id": 10,
    "campaignId": 5,
    "winegrowerId": 1,
    "vineyardCode": "B2025-VINEYARD01",
    "receptionDate": "2025-06-03",
    "harvestCampaign": 2025,
    "vineyardOrigin": "Valle de Ica",
    "grapeVariety": "MALBEC",
    "initialGrapeQuantityKg": 3200,
    "createdBy": "Luis Carlos Prada Naez",
    "progress": 0,
    "status": "NOT_STARTED",
    "currentStage": "RECEPTION"
  }
*/

export class WineBatch {
    constructor(
        {
            id = '',
            campaignId = '',
            winegrowerId = '',
            vineyardCode = '',
            receptionDate = '',
            harvestCampaign = '',
            vineyardOrigin = '',
            grapeVariety = '',
            initialGrapeQuantityKg = 0,
            createdBy = '',
            progress = 0,
            status = 'NOT_STARTED',
            currentStage = 'RECEPTION'
        }
    ) {
        this.id = id;
        this.campaignId = campaignId;
        this.winegrowerId = winegrowerId;
        this.vineyardCode = vineyardCode;
        this.receptionDate = receptionDate;
        this.harvestCampaign = harvestCampaign;
        this.vineyardOrigin = vineyardOrigin;
        this.grapeVariety = grapeVariety;
        this.initialGrapeQuantityKg = initialGrapeQuantityKg;
        this.createdBy = createdBy;
        this.progress = progress;
        this.status = status;
        this.currentStage = currentStage;
    }
}