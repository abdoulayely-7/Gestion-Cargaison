import {CargaisonEtatGlobal} from "../enums/CargaisonEtatGlobal.js";
import {CargaisonEtatAvancement} from "../enums/CargaisonEtatAvancement.js";
import {CargaisonType} from "../enums/CargaisonType.js";
import type {Colis} from "./Colis.js";
import {ColisType} from "../enums/ColisType.js";

export class Cargaison {
    public id?: number;
    public numero: string;
    public etatGlobal: CargaisonEtatGlobal = CargaisonEtatGlobal.OUVERT;
    public colis: Colis[];
    public prixTotalCargaison: number = 0; // prix total stocké

    constructor(
        public poidsMax: number,
        public type: CargaisonType,
        public lieuDepart: string,
        public lieuArrivee: string,
        public distance: number,
        
        public etatAvancement: CargaisonEtatAvancement = CargaisonEtatAvancement.EN_ATTENTE,
        public dateDepart?: string ,
        public dateArrivee?: string 
    ) {
        this.numero = `CARG${Date.now()}`;
        this.colis = [];
    }

    // Calcul du prix d'un colis selon le type
    private calculerPrixColis(colis: Colis): number {
        const poids = colis.poids;
        const typeColis = colis.typeProduit;
        const typeCargaison = this.type;

        let prix = 0;

        switch (typeColis) {
            case ColisType.ALIMENTAIRE:
                if (typeCargaison === CargaisonType.ROUTIERE) prix = 100 * poids * this.distance;
                else if (typeCargaison === CargaisonType.MARITIME) prix = 90 * poids * this.distance + 5000;
                else if (typeCargaison === CargaisonType.AERIENNE) prix = 300 * poids * this.distance;
                break;

            case ColisType.CHIMIQUE:
                if (typeCargaison !== CargaisonType.MARITIME)
                    throw new Error(`Colis chimique doit transiter par voie maritime`);
                prix = 500 * poids * this.distance + 10000;
                break;

            case ColisType.MATERIEL_FRAGILE:
            case ColisType.MATERIEL_INCASSABLE:
                if (typeCargaison === CargaisonType.ROUTIERE) prix = 200 * poids * this.distance;
                else if (typeCargaison === CargaisonType.MARITIME) prix = 400 * poids * this.distance;
                else if (typeCargaison === CargaisonType.AERIENNE) prix = 1000 * poids * this.distance;

                if (typeColis === ColisType.MATERIEL_FRAGILE && typeCargaison === CargaisonType.MARITIME)
                    throw new Error(`Colis fragile ne peut pas passer par voie maritime`);
                break;
        }

        if (prix < 10000) prix = 10000;

        return prix;
    }

    public ajouterColis(colis: Colis): void {
        if (this.etatGlobal === CargaisonEtatGlobal.FERME)
            throw new Error("Impossible d'ajouter un colis : la cargaison est fermée.");

        const poidsTotal = this.colis.reduce((acc, c) => acc + c.poids, 0) + colis.poids;
        if (poidsTotal > this.poidsMax)
            throw new Error("Impossible d'ajouter le colis : poids total dépassera le maximum autorisé.");

        // Vérification des contraintes produit ↔ type de cargaison
        switch (colis.typeProduit) {
            case ColisType.CHIMIQUE:
                if (this.type !== CargaisonType.MARITIME)
                    throw new Error("Colis chimique doit transiter par voie maritime.");
                break;
            case ColisType.MATERIEL_FRAGILE:
                if (this.type === CargaisonType.MARITIME)
                    throw new Error("Colis matériel fragile ne peut pas passer par voie maritime.");
                break;
        }

        this.colis.push(colis);

        // Mettre à jour le prix total stocké
        this.prixTotalCargaison = this.colis.reduce((acc, c) => acc + this.calculerPrixColis(c), 0);
    }

    public fermer(): void {
        this.etatGlobal = CargaisonEtatGlobal.FERME;
    }

    public rouvrir(): void {
        if (this.etatAvancement === CargaisonEtatAvancement.EN_ATTENTE)
            this.etatGlobal = CargaisonEtatGlobal.OUVERT;
    }
}
