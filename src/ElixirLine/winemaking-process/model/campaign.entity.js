
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
            id,
            name,
            createdBy,
            startDate,
            endDate,
            batchesQuantity,
            status,
        }
    ) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.createdBy = createdBy;
        this.endDate = endDate;
        this.batchesQuantity = batchesQuantity;
        this.status = status;
    }




}

