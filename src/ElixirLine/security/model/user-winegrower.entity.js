

export class UserWinegrower {

    constructor(
        {
            userId = null,
            name = null,
            lastname = null,
            country = null,
            phoneNumber = null
        }
    ) {
        this.userId = userId;
        this.name = name;
        this.lastname = lastname;
        this.country = country;
        this.phoneNumber = phoneNumber;
    }
}