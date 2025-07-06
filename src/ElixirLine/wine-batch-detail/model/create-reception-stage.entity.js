

export class CreateReceptionStage {
    constructor(
        {
            employee = '',
            startDate = '',
            endDate = '',
            sugarLevel = 0,
            pHLevel = 0,
            temperature = 0,
            quantityKg = 0,
            comment = ''
        }
    ) {
        this.employee = employee;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sugarLevel = sugarLevel;
        this.pHLevel = pHLevel;
        this.temperature = temperature;
        this.quantityKg = quantityKg;
        this.comment = comment;
    }
}