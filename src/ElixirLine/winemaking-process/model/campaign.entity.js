
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

