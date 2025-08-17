import { CargaisonEtatAvancement } from "../enums/CargaisonEtatAvancement.js";
import { CargaisonEtatGlobal } from "../enums/CargaisonEtatGlobal.js";
import { CargaisonType } from "../enums/CargaisonType.js";
import { ColisType } from "../enums/ColisType.js";
export class Cargaison {
    poidsMax;
    colis;
    type;
    lieuDepart;
    lieuArrivee;
    distance;
    etatAvancement;
    dateDepart;
    dateArrivee;
    id;
    numero;
    etatGlobal = CargaisonEtatGlobal.OUVERT;
    static nextId = 0;
    constructor(poidsMax, colis = [], type, lieuDepart, lieuArrivee, distance, etatAvancement = CargaisonEtatAvancement.EN_ATTENTE, dateDepart, dateArrivee) {
        this.poidsMax = poidsMax;
        this.colis = colis;
        this.type = type;
        this.lieuDepart = lieuDepart;
        this.lieuArrivee = lieuArrivee;
        this.distance = distance;
        this.etatAvancement = etatAvancement;
        this.dateDepart = dateDepart;
        this.dateArrivee = dateArrivee;
        this.id = Cargaison.nextId++;
        this.numero = `CARG${Date.now()}${this.id}`;
    }
    get prixTotal() {
        let total = 0;
        for (const c of this.colis) {
            const poids = c.poids;
            const typeColis = c.typeProduit;
            const typeCargaison = this.type;
            let prix = 0;
            switch (typeColis) {
                case ColisType.ALIMENTAIRE:
                    if (typeCargaison === CargaisonType.ROUTIERE)
                        prix = 100 * poids * this.distance;
                    else if (typeCargaison === CargaisonType.MARITIME)
                        prix = 90 * poids * this.distance + 5000;
                    else if (typeCargaison === CargaisonType.AERIENNE)
                        prix = 300 * poids * this.distance;
                    break;
                case ColisType.CHIMIQUE:
                    if (typeCargaison !== CargaisonType.MARITIME)
                        throw new Error(`Colis chimique doit transiter par voie maritime`);
                    prix = 500 * poids * this.distance + 10000;
                    break;
                case ColisType.MATERIEL_FRAGILE:
                case ColisType.MATERIEL_INCASSABLE:
                    if (typeCargaison === CargaisonType.ROUTIERE)
                        prix = 200 * poids * this.distance;
                    else if (typeCargaison === CargaisonType.MARITIME)
                        prix = 400 * poids * this.distance;
                    else if (typeCargaison === CargaisonType.AERIENNE)
                        prix = 1000 * poids * this.distance;
                    if (typeColis === ColisType.MATERIEL_FRAGILE && typeCargaison === CargaisonType.MARITIME) {
                        throw new Error(`Colis fragile ne peut pas passer par voie maritime`);
                    }
                    break;
            }
            if (prix < 10000)
                prix = 10000;
            total += prix;
        }
        return total;
    }
    ajouterColis(colis) {
        if (this.etatGlobal === CargaisonEtatGlobal.FERME) {
            throw new Error("Impossible d'ajouter un colis : la cargaison est fermée.");
        }
        const poidsTotal = this.colis.reduce((acc, c) => acc + c.poids, 0) + colis.poids;
        if (poidsTotal > this.poidsMax) {
            throw new Error("Impossible d'ajouter le colis : poids total dépassera le maximum autorisé.");
        }
        // Vérification des contraintes produit ↔ type de cargaison
        switch (colis.typeProduit) {
            case ColisType.CHIMIQUE:
                if (this.type !== CargaisonType.MARITIME) {
                    throw new Error("Colis chimique doit transiter par voie maritime.");
                }
                break;
            case ColisType.MATERIEL_FRAGILE:
                if (this.type === CargaisonType.MARITIME) {
                    throw new Error("Colis matériel fragile ne peut pas passer par voie maritime.");
                }
                break;
            // Alimentaire et matériel incassable : pas de contraintes spécifiques ici
        }
        this.colis.push(colis);
        // Prix total sera automatiquement recalculé via le getter `prixTotal`
    }
    fermer() {
        this.etatGlobal = CargaisonEtatGlobal.FERME;
    }
    rouvrir() {
        if (this.etatAvancement === CargaisonEtatAvancement.EN_ATTENTE) {
            this.etatGlobal = CargaisonEtatGlobal.OUVERT;
        }
    }
}
//# sourceMappingURL=Cargaison.js.map