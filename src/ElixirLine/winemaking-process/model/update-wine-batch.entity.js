

/*
{
  "campaignId": 9007199254740991,
  "vineyardCode": "string",
  "vineyardOrigin": "string",
  "grapeVariety": "string",
  "harvestCampaign": 1073741824,
  "receptionDate": "2025-07-03",
  "initialGrapeQuantityKg": 0.1
}
 */

class UpdateWineBatchEntity {

    constructor(
        {
            campaignId,
            vineyardCode,
            vineyardOrigin,
            grapeVariety,
            harvestCampaign,
            receptionDate,
            initialGrapeQuantityKg
        }
    ) {
        this.campaignId = campaignId;
        this.vineyardCode = vineyardCode;
        this.vineyardOrigin = vineyardOrigin;
        this.grapeVariety = grapeVariety;
        this.harvestCampaign = harvestCampaign;
        this.receptionDate = receptionDate;
        this.initialGrapeQuantityKg = initialGrapeQuantityKg;
    }

}