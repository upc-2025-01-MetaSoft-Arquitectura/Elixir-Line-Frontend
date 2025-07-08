/*
{
  "userId": 9007199254740991,
  "name": "string",
  "lastname": "string",
  "phoneNumber": "string",
  "winegrowerId": 9007199254740991
}
*/

export class CreateEmployee {

    constructor(
        {
            userId,
            name,
            lastname,
            phoneNumber,
            winegrowerId
        }
    )
    {
        this.userId = userId;
        this.name = name;
        this.lastname = lastname;
        this.phoneNumber = phoneNumber;
        this.winegrowerId = winegrowerId;
    }
}