
export class CreateSupply {

    constructor(
        {
        userId = 0,
        name = '',
        description = '',
        quantity = 0,
        unit = '',
        image = ''
        }
    ) {
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.unit = unit;
        this.image = image;
    }

}