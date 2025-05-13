

export class WineBatch {

    constructor({ id='', grape_variety='', harvest_date='',
                    grape_quantity='', vineyard_origin='', current_status='',
                    process_start_date='', final_volume=''
                }) {
        this.id = id;
        this.grape_variety = grape_variety;
        this.harvest_date = harvest_date;
        this.grape_quantity = grape_quantity;
        this.vineyard_origin = vineyard_origin;
        this.current_status = current_status;
        this.process_start_date = process_start_date;
        this.final_volume = final_volume;
    }

}