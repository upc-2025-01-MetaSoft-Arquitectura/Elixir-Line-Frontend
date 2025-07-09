
/*
{
  "id": 1,
  "email": "user1@example.com",
  "roles": "VINEGROWER"
}
 */

export class User {

    constructor({id = '', email = '', roles =''}) {
        this.id = id;
        this.email = email;
        this.roles = roles;
    }

}