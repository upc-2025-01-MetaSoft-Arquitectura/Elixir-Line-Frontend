import {ReceptionStage} from "./receptionStage.entity.js";
import {CorrectionStage} from "./correctionStage.entity.js";
import {FermentationStage} from "./fermentationStage.entity.js";
import {PressingStage} from "./pressingStage.entity.js";
import {ClarificationStage} from "./clarificationStage.entity.js";
import {AgingStage} from "./agingStage.entity.js";
import {FiltrationStage} from "./filtrationStage.entity.js";
import {BottlingStage} from "./bottlingStage.entity.js";


export class Stages {
    constructor({
                    id = null,
                    batchId = null,
                    receptionStage = null,
                    correctionStage = null,
                    fermentationStage = null,
                    pressingStage = null,
                    clarificationStage = null,
                    agingStage = null,
                    filtrationStage = null,
                    bottlingStage = null,
                }) {
        this.id = id;
        this.batchId = batchId;

        this.receptionStage = receptionStage ? new ReceptionStage(receptionStage) : null;
        this.correctionStage = correctionStage ? new CorrectionStage(correctionStage) : null;
        this.fermentationStage = fermentationStage ? new FermentationStage(fermentationStage) : null;

        // Para las que aún no tienen entidad definida, puedes mantenerlas como objetos o null:
        this.pressingStage = pressingStage? new PressingStage(pressingStage) : null;
        this.clarificationStage = clarificationStage? new ClarificationStage(clarificationStage) : null;
        this.agingStage = agingStage? new AgingStage(agingStage) : null;
        this.filtrationStage = filtrationStage? new FiltrationStage(filtrationStage) : null;
        this.bottlingStage = bottlingStage? new BottlingStage(bottlingStage) : null;
    }

}