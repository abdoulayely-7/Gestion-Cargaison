import { CargaisonEtatAvancement } from "../enums/CargaisonEtatAvancement.js";
import { CargaisonEtatGlobal } from "../enums/CargaisonEtatGlobal.js";
import { CargaisonType } from "../enums/CargaisonType.js";
import type { Colis } from "./Colis.js";
export declare class Cargaison {
    poidsMax: number;
    colis: Colis[];
    type: CargaisonType;
    lieuDepart: string;
    lieuArrivee: string;
    distance: number;
    etatAvancement: CargaisonEtatAvancement;
    dateDepart: string;
    dateArrivee: string;
    id: number;
    numero: string;
    etatGlobal: CargaisonEtatGlobal;
    private static nextId;
    constructor(poidsMax: number, colis: Colis[] | undefined, type: CargaisonType, lieuDepart: string, lieuArrivee: string, distance: number, etatAvancement: CargaisonEtatAvancement | undefined, dateDepart: string, dateArrivee: string);
    get prixTotal(): number;
    ajouterColis(colis: Colis): void;
    fermer(): void;
    rouvrir(): void;
}
//# sourceMappingURL=Cargaison.d.ts.map