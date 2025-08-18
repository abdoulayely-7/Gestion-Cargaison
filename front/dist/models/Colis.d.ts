import { ColisEtat } from "../enums/ColisEtat.js";
import type { CargaisonType } from "../enums/CargaisonType.js";
import type { User } from "../interface/User.js";
import type { ColisType } from "../enums/ColisType.js";
export declare class Colis {
    etat: ColisEtat;
    poids: number;
    expediteur: User;
    destinataire: User;
    typeProduit: ColisType;
    typeCargaison: CargaisonType;
    dateEnregistrement: string;
    dateLivraisonPrev?: string | undefined;
    notes?: string | undefined;
    code: string;
    id?: number;
    constructor(etat: ColisEtat | undefined, poids: number, expediteur: User, destinataire: User, typeProduit: ColisType, typeCargaison: CargaisonType, dateEnregistrement?: string, dateLivraisonPrev?: string | undefined, notes?: string | undefined);
    private generateCode;
    changerEtat(etat: ColisEtat): void;
}
//# sourceMappingURL=Colis.d.ts.map