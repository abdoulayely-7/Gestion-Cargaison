import {ColisEtat} from "../enums/ColisEtat.js";
import type {CargaisonType} from "../enums/CargaisonType.js";
import type {User} from "../interface/User.js";
import type {ColisType} from "../enums/ColisType.js";

export class Colis{
    public code: string;

    public id?: number ;

    constructor(
        public etat: ColisEtat = ColisEtat.EN_ATTENTE,
        public poids: number,
        public expediteur: User,
        public destinataire: User,
        public typeProduit:ColisType,
        public typeCargaison: CargaisonType,
        public dateEnregistrement: string= new Date().toISOString(),
        public dateLivraisonPrev?: string,
        public notes?: string
) {
        this.code = this.generateCode();
    }

private generateCode(): string {

        return `COL${Date.now()}${this.id}`;
    }

public  changerEtat(etat: ColisEtat): void{
        this.etat = etat;
    }
}