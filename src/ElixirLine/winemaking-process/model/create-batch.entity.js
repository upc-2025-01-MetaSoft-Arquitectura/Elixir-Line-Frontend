
/*
{
  "winegrowerId": 9007199254740991,
  "campaignId": 9007199254740991,
  "vineyardCode": "string",
  "vineyardOrigin": "string",
  "grapeVariety": "string",
  "harvestCampaign": 1073741824,
  "receptionDate": "2025-07-06",
  "initialGrapeQuantityKg": 0.1,
  "createdBy": "string"
}
*/
export class CreateBatch {

    constructor(
        {
            winegrowerId = null,
            campaignId = null,
            vineyardCode = "",
            vineyardOrigin = "",
            grapeVariety = "",
            harvestCampaign = null,
            receptionDate = "",
            initialGrapeQuantityKg = null,
            createdBy = ""
        }
    ) {
        this.winegrowerId = winegrowerId;
        this.campaignId = campaignId;
        this.vineyardCode = vineyardCode;
        this.vineyardOrigin = vineyardOrigin;
        this.grapeVariety = grapeVariety;
        this.harvestCampaign = harvestCampaign;
        this.receptionDate = receptionDate;
        this.initialGrapeQuantityKg = initialGrapeQuantityKg;
        this.createdBy = createdBy;
    }

}