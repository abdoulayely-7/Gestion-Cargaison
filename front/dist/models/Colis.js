import { ColisEtat } from "../enums/ColisEtat.js";
export class Colis {
    etat;
    poids;
    expediteur;
    destinataire;
    typeProduit;
    typeCargaison;
    dateEnregistrement;
    dateLivraisonPrev;
    notes;
    code;
    id;
    static nextId = 0;
    constructor(etat = ColisEtat.EN_ATTENTE, poids, expediteur, destinataire, typeProduit, typeCargaison, dateEnregistrement = new Date().toISOString(), dateLivraisonPrev, notes) {
        this.etat = etat;
        this.poids = poids;
        this.expediteur = expediteur;
        this.destinataire = destinataire;
        this.typeProduit = typeProduit;
        this.typeCargaison = typeCargaison;
        this.dateEnregistrement = dateEnregistrement;
        this.dateLivraisonPrev = dateLivraisonPrev;
        this.notes = notes;
        this.code = this.generateCode();
        this.id = Colis.nextId++;
    }
    generateCode() {
        return `COL${Date.now()}${this.id}`;
    }
    changerEtat(etat) {
        this.etat = etat;
    }
}
//# sourceMappingURL=Colis.js.map