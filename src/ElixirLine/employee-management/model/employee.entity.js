export class FieldWorker {
    constructor({
                    id,
                    userId,
                    name,
                    lastname,
                    phoneNumber,
                    profilePicture,
                    winegrowerId,
                    status
                }) {
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