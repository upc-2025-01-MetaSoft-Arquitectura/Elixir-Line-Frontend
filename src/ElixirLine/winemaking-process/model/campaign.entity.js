
export class Campaign {
    /**
     * @constructor
     * @param id
     * @param name
     * @param createdBy
     * @param startDate
     * @param endDate
     * @param batchesQuantity
     * @param status
     * @param acciones
     */
    constructor(
        {
            id = '',
            name = '',
            createdBy = '',
            startDate = '',
            endDate = '',
            batchesQuantity = '',
            status = '',
            acciones = ''
        }
    ) {
        this.id = id;
        this.name = name;
        this.createdBy = createdBy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.batchesQuantity = batchesQuantity;
        this.status = status;
        this.acciones = acciones;
    }




}

