
export class Supply {
  constructor(
      {
          id = '',
          name = '',
          quantity = '',
          unidad = '',
          image = ''
      }
  ) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.unidad = unidad;
    this.image = image;
  }
}