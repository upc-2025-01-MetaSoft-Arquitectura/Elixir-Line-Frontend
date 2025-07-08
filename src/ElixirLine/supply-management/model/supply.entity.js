

export class Supply {

    constructor(
        {
            id = '',
            userId = '',
            name = '',
            description = '',
            quantity = '',
            unit = '',
            image = ''
        }
    ) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.unit = unit;
        this.image = image;
    }
}