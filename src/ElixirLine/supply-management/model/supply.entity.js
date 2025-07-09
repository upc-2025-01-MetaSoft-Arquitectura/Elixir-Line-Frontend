

export class Supply {

    constructor(
        {
            id = '',
            winegrowerId = '',
            name = '',
            description = '',
            quantity = '',
            unit = '',
            image = ''
        }
    ) {
        this.id = id;
        this.winegrowerId = winegrowerId;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.unit = unit;
        this.image = image;
    }
}