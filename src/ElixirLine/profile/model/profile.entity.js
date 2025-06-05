

export class Profile {

    constructor(
        {
            id = '',
            user_id = '',
            name = '',
            surname = '',
            email = '',
            country = '',
            phone = '',
            user_type = ''
        }
    ) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.country = country;
        this.phone = phone;
        this.user_type = user_type;
    }

}