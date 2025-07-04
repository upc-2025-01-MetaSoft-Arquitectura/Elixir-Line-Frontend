
/*
{
  "id": 1,
  "name": "Campaña 2023",
  "year": "2023",
  "winegrowerId": 5,
  "batches": 10,
  "status": "EN_PROCESO",
  "startDate": "2023-01-01",
  "endDate": "2023-12-31"
}
 */


export class Campaign {

    constructor(
        {
            id = '',
            name = '',
            year = '',
            winegrowerId = '',
            batches = 0,
            status = '',
            startDate = '',
            endDate = ''
        }
    ) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.winegrowerId = winegrowerId;
        this.batches = batches;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
    }



}

