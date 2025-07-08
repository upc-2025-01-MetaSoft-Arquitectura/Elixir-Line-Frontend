
export class CreateFieldWorker {

    constructor(
        {
            userId = null,
            name = null,
            lastname = null,
            phoneNumber = null,
            winegrowerId = null
        }
    ) {
        this.userId = userId;
        this.name = name;
        this.lastname = lastname;
        this.phoneNumber = phoneNumber;
        this.winegrowerId = winegrowerId;
    }

}