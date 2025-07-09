
/*
  id = null,
            userId = null,
            name = null,
            lastname = null,
            phoneNumber = null,
            winegrowerId = null,
            email = null,
            password = null
 */

export class CreateUserWinegrower {


    constructor(
        {
            email = null,
            password = null,
            role = 'WINEGROWER',
            userId = null,
            name = null,
            lastname = null,
            phoneNumber = null,
            country = null,
        }
    ) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.userId = userId;
        this.name = name;
        this.lastname = lastname;
        this.phoneNumber = phoneNumber;
        this.country = country;
    }


}