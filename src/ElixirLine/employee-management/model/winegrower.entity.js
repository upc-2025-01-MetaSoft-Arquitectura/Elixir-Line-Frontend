


export class Winegrower {

    constructor(
        {
            id = null,
            userId = null,
            name = "",
            lastname = "",
            country = "",
            phoneNumber = "",
            profilePicture = "",
            status = ""
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