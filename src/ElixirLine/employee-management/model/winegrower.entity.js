
/*
{
  "id": 1,
  "userId": 5,
  "name": "Juan Carlos",
  "lastname": "Pérez Gómez",
  "country": "Perú",
  "phoneNumber": "923456789",
  "profilePicture": "https://example.com/profile.jpg",
  "status": "ACTIVE"
}
 */

export class Winegrower {

    constructor(
        {
            id = null,
            userId = null,
            name = null,
            lastname = null,
            country = null,
            phoneNumber = null,
            profilePicture = null,
            status = "ACTIVE"
        }
    ) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.lastname = lastname;
        this.country = country;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.status = status;
    }

}