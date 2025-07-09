


export class FieldWorker {

    constructor(
        {
            id = null,
            userId = null,
            name = null,
            lastname = null,
            phoneNumber = null,
            profilePicture = null,
            winegrowerId = null,
            status = "ACTIVE"
        }
    ) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.lastname = lastname;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.winegrowerId = winegrowerId;
        this.status = status;
    }
}