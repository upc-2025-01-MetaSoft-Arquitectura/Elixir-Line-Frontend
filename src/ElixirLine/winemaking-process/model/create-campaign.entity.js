

/*
 {
    "name": "Campaña Cosecha Tardía 2025",
    "year": "2025",
    "winegrowerId": 2,
    "batches": 0,
    "status": "NO_INICIADO",
    "startDate": "2025-10-10",
    "endDate": null
  }
 */

export class CreateCampaign {
    constructor(
        {
            name ="",
            year = "",
            winegrowerId = null,
            batches = null,
            status = "",
            startDate = "",
            endDate = ""
        }
    ) {
        this.name = name;
        this.year = year;
        this.winegrowerId = winegrowerId;
        this.batches = batches;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
    }


}