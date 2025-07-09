

/*
{
  "name": "string",
  "lastname": "string",
  "phoneNumber": "string",
  "winegrowerId": 9007199254740991,
  "image": "string"
}
 */


export class UpdateFieldworker {

    constructor(
        {
            name = null,
            lastname = null,
            phoneNumber = null,
            winegrowerId = null,
            image = null
        }
    ) {
        this.name = name;
        this.lastname = lastname;
        this.phoneNumber = phoneNumber;
        this.winegrowerId = winegrowerId;
        this.image = image;
    }

}