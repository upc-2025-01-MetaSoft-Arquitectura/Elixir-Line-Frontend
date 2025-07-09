
export class CreateSupply {

    constructor(
        {
            winegrowerId = 0,
            name = '',
            description = '',
            quantity = 0,
            unit = '',
            image = ''
        }
    ) {
        this.winegrowerId = winegrowerId;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.unit = unit;
        this.image = image;
    }

}