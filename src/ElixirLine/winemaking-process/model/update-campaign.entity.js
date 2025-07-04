
/*
{
  "name": "string",
  "year": "string",
  "startDate": "2025-07-03",
  "endDate": "2025-07-03"
}
*/

export class UpdateCampaignEntity {
    constructor(
        {
            name,
            year,
            startDate,
            endDate
        }
    ) {
        this.name = name;
        this.year = year;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}