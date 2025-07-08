
/*
{
  "email": "string",
  "password": "string"
}
 */

export class UpdateUser {

    constructor(
        {
            email = null,
            password = null,
        }
    ) {
        this.email = email;
        this.password = password;
    }


}